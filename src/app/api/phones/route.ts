import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// atau: import { prisma } from '@/lib/prisma'; kalau kamu export-nya named

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  const where = q
    ? {
        OR: [
          { brand: { contains: q } },
          { model: { contains: q } },
        ],
      }
    : {};

  const phones = await prisma.phone.findMany({
    where,
    take: 20,
  });

  return NextResponse.json(phones);
}
