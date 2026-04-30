// src/app/api/laptops/import/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// ==================== PARSER FUNCTIONS ====================
function parseRamGb(raw: string): number | null {
    const m = raw.match(/(\d+)\s*GB/i);
    return m ? parseInt(m[1]) : null;
}

function parseStorageGb(raw: string): number | null {
    const tb = raw.match(/(\d+)\s*TB/i);
    if (tb) return parseInt(tb[1]) * 1024;
    const gb = raw.match(/(\d+)\s*GB/i);
    return gb ? parseInt(gb[1]) : null;
}

function parseResolution(raw: string): { x: number | null; y: number | null } {
    const m = raw.match(/(\d+)\s*[xX×]\s*(\d+)/);
    return m ? { x: parseInt(m[1]), y: parseInt(m[2]) } : { x: null, y: null };
}

function parseScreenSize(raw: string): number | null {
    const m = raw.match(/([\d.]+)\s*inch/i);
    return m ? parseFloat(m[1]) : null;
}

function parseCpuBrandModel(raw: string): { brand: string; model: string } {
    const cleaned = raw.replace(/\s+/g, " ").trim();
    if (/intel/i.test(cleaned)) return { brand: "Intel", model: cleaned.replace(/^.*?intel\s*/i, "Intel ").trim() };
    if (/amd/i.test(cleaned)) return { brand: "AMD", model: cleaned.replace(/^.*?amd\s*/i, "AMD ").trim() };
    if (/apple/i.test(cleaned)) return { brand: "Apple", model: cleaned };
    if (/qualcomm/i.test(cleaned)) return { brand: "Qualcomm", model: cleaned };
    return { brand: "Unknown", model: cleaned };
}

function parseGpuBrandModel(raw: string): { brand: string; model: string } {
    const cleaned = raw.replace(/^\d+\s*GB\s*/i, "").replace(/\s+/g, " ").trim();
    if (/nvidia/i.test(cleaned)) return { brand: "NVIDIA", model: cleaned };
    if (/amd|radeon/i.test(cleaned)) return { brand: "AMD", model: cleaned };
    if (/intel/i.test(cleaned)) return { brand: "Intel", model: cleaned };
    if (/apple/i.test(cleaned)) return { brand: "Apple", model: cleaned };
    return { brand: "Unknown", model: cleaned };
}

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 191);
}

// ==================== CSV ROW PARSER (handling quotes & koma dalam field) ====================
// Format: 16 kolom (index 0-15)
function parseRow(line: string): string[] | null {
    if (!line.trim()) return null;
    const parts: string[] = [];
    let current = "";
    let inQuote = false;
    let commaCount = 0;
    const MAX_COLUMNS = 16;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuote = !inQuote;
            current += ch;
        } else if (ch === ',' && !inQuote && commaCount < MAX_COLUMNS - 1) {
            parts.push(current.trim());
            current = "";
            commaCount++;
        } else {
            current += ch;
        }
    }
    parts.push(current.trim());
    if (parts.length < MAX_COLUMNS) return null;
    return parts;
}

// ==================== MAIN POST HANDLER ====================
export async function POST() {
    try {
        const csvPath = path.join(process.cwd(), "data", "laptops.csv");

        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: `CSV not found at ${csvPath}` }, { status: 404 });
        }

        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter(l => l.trim());
        if (lines.length === 0) {
            return NextResponse.json({ error: "CSV is empty" }, { status: 400 });
        }

        // Skip header (baris pertama)
        const dataLines = lines.slice(1);
        let imported = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const line of dataLines) {
            const parts = parseRow(line);
            if (!parts) {
                skipped++;
                errors.push(`Invalid row format: ${line.substring(0, 100)}...`);
                continue;
            }

            // Destructure 16 kolom
            const [
                name, brand, priceRaw, , , ,
                cpuRaw, ramRaw, storageRaw, gpuRaw,
                screenRaw, resRaw, , , ,
                imageUrl
            ] = parts;

            if (!name || !brand) {
                skipped++;
                errors.push(`Missing name or brand: ${name} | ${brand}`);
                continue;
            }

            try {
                const price = Math.round(parseFloat(priceRaw) * 1000);
                const ram = parseRamGb(ramRaw);
                const storage = parseStorageGb(storageRaw);
                const { x: resX, y: resY } = parseResolution(resRaw ?? "");
                const screenSize = parseScreenSize(screenRaw ?? "");
                const cpuParsed = parseCpuBrandModel(cpuRaw ?? "");
                const gpuParsed = parseGpuBrandModel(gpuRaw ?? "");
                const laptopSlug = slugify(name);

                // Upsert CPU
                const cpu = await prisma.cPU.upsert({
                    where: { brand_model: { brand: cpuParsed.brand, model: cpuParsed.model } },
                    create: {
                        brand: cpuParsed.brand,
                        model: cpuParsed.model,
                        slug: slugify(`${cpuParsed.brand}-${cpuParsed.model}`)
                    },
                    update: {},
                });

                // Upsert GPU
                const gpu = await prisma.gPU.upsert({
                    where: { brand_model: { brand: gpuParsed.brand, model: gpuParsed.model } },
                    create: {
                        brand: gpuParsed.brand,
                        model: gpuParsed.model,
                        slug: slugify(`${gpuParsed.brand}-${gpuParsed.model}`)
                    },
                    update: {},
                });

                // Upsert Laptop menggunakan connect untuk relasi
                await prisma.laptop.upsert({
                    where: { brand_model: { brand, model: name } },
                    create: {
                        brand,
                        model: name,
                        slug: laptopSlug,
                        cpu: { connect: { id: cpu.id } },
                        gpu: { connect: { id: gpu.id } },
                        ramGb: ram,
                        storageGb: storage,
                        priceIdr: price,
                        screenSizeInch: screenSize,
                        screenResolutionX: resX,
                        screenResolutionY: resY,
                        imageUrl: imageUrl?.trim() || null,
                    },
                    update: {
                        cpu: { connect: { id: cpu.id } },
                        gpu: { connect: { id: gpu.id } },
                        ramGb: ram,
                        storageGb: storage,
                        priceIdr: price,
                        screenSizeInch: screenSize,
                        screenResolutionX: resX,
                        screenResolutionY: resY,
                        imageUrl: imageUrl?.trim() || null,
                    },
                });

                imported++;
                if (imported % 50 === 0) console.log(`Imported ${imported} laptops...`);
            } catch (e) {
                errors.push(`Row "${name}": ${e instanceof Error ? e.message : String(e)}`);
                skipped++;
            }
        }

        return NextResponse.json({ success: true, imported, skipped, errors });
    } catch (e) {
        console.error("Import error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}

// GET preview (untuk test)
export async function GET() {
    try {
        const csvPath = path.join(process.cwd(), "data", "laptops.csv");
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: "CSV not found" }, { status: 404 });
        }
        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter(l => l.trim()).slice(1, 101);
        const previews = lines.map((line) => {
            const parts = parseRow(line);
            if (!parts) return null;
            const [name, brand, priceRaw, , , , cpuRaw, ramRaw, storageRaw, gpuRaw, , , , , , imageUrl] = parts;
            return { name, brand, price: parseFloat(priceRaw), cpu: cpuRaw, ram: ramRaw, storage: storageRaw, gpu: gpuRaw, imageUrl };
        }).filter(Boolean);
        return NextResponse.json({ laptops: previews });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}