import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || '';

  const laptops = await prisma.laptop.findMany({
    where: q
      ? {
          OR: [
            { brand: { contains: q } },
            { model: { contains: q } },
          ],
        }
      : undefined,
    include: {
      cpu: true,
      gpu: true,
    },
    take: 20,
    orderBy: [
      { brand: 'asc' },
      { model: 'asc' },
    ],
  });

  return NextResponse.json(laptops);
}