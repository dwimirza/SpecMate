// src/app/api/laptops/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const laptops = await prisma.laptop.findMany({
            include: { cpu: true, gpu: true },
            orderBy: { brand: "asc" },
        });
        return NextResponse.json({ laptops });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}