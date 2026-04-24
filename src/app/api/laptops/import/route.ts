// src/app/api/laptops/import/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// ─── CSV PARSERS ──────────────────────────────────────────────────────────────

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
    // Try to extract brand
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

// ─── PARSE CSV ROWS ───────────────────────────────────────────────────────────

// CSV rows may have commas inside fields without quotes — we split carefully.
// The format is: name,brand,price,rating,reviews,os,cpu,ram,storage,gpu,screen_size,resolution,cores,warranty,image_url
// "cores" field can contain a comma (e.g. "Quad Core, 8 Threads"), so we split by
// limiting to 14 splits and treating the rest as one field.
function parseRow(line: string): string[] | null {
    if (!line.trim()) return null;
    // Split on commas but max 14 splits (15 fields total: 0-14)
    const parts: string[] = [];
    let current = "";
    let count = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === "," && count < 14) {
            parts.push(current.trim());
            current = "";
            count++;
        } else {
            current += line[i];
        }
    }
    parts.push(current.trim());
    if (parts.length < 14) return null;
    return parts;
}

// ─── ROUTE HANDLER ────────────────────────────────────────────────────────────

export async function POST() {
    try {
        const csvPath = path.join(process.cwd(), "data", "laptops.csv");

        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: "CSV file not found at data/laptops.csv" }, { status: 404 });
        }

        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter((l) => l.trim());

        let imported = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const line of lines) {
            const parts = parseRow(line);
            if (!parts) { skipped++; continue; }

            const [name, brand, priceRaw, , , , cpuRaw, ramRaw, storageRaw, gpuRaw, screenRaw, resRaw, , , imageUrl] = parts;

            if (!name || !brand) { skipped++; continue; }

            try {
                const price = Math.round(parseFloat(priceRaw) * 1000); // assume CSV is in thousands IDR or USD — adjust multiplier as needed
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
                    create: { brand: cpuParsed.brand, model: cpuParsed.model, slug: slugify(`${cpuParsed.brand}-${cpuParsed.model}`) },
                    update: {},
                });

                // Upsert GPU
                const gpu = await prisma.gPU.upsert({
                    where: { brand_model: { brand: gpuParsed.brand, model: gpuParsed.model } },
                    create: { brand: gpuParsed.brand, model: gpuParsed.model, slug: slugify(`${gpuParsed.brand}-${gpuParsed.model}`) },
                    update: {},
                });

                // Upsert Laptop
                await prisma.laptop.upsert({
                    where: { brand_model: { brand, model: name } },
                    create: {
                        brand,
                        model: name,
                        slug: laptopSlug,
                        cpuId: cpu.id,
                        gpuId: gpu.id,
                        ramGb: ram,
                        storageGb: storage,
                        priceIdr: price,
                        screenSizeInch: screenSize,
                        screenResolutionX: resX,
                        screenResolutionY: resY,
                    },
                    update: {
                        cpuId: cpu.id,
                        gpuId: gpu.id,
                        ramGb: ram,
                        storageGb: storage,
                        priceIdr: price,
                        screenSizeInch: screenSize,
                        screenResolutionX: resX,
                        screenResolutionY: resY,
                    },
                });

                imported++;
            } catch (e) {
                errors.push(`Row "${name}": ${e instanceof Error ? e.message : String(e)}`);
                skipped++;
            }
        }

        return NextResponse.json({ success: true, imported, skipped, errors });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}

// GET — preview CSV without importing
export async function GET() {
    try {
        const csvPath = path.join(process.cwd(), "data", "laptops.csv");
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: "CSV not found" }, { status: 404 });
        }
        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter((l) => l.trim()).slice(0, 100);

        const previews = lines.map((line) => {
            const parts = parseRow(line);
            if (!parts) return null;
            const [name, brand, priceRaw, , , , cpuRaw, ramRaw, storageRaw, gpuRaw, , , , , imageUrl] = parts;
            return { name, brand, price: parseFloat(priceRaw), cpu: cpuRaw, ram: ramRaw, storage: storageRaw, gpu: gpuRaw, imageUrl };
        }).filter(Boolean);

        return NextResponse.json({ laptops: previews });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}