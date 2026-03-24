import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ids: number[] = body.ids || [];

  if (!ids.length) {
    return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
  }

  const phones = await prisma.phone.findMany({
    where: { id: { in: ids } },
  });

  const withScore = phones.map((p) => {
    const perf = (p.benchmark ?? 0) * (p.ramGb ?? 0);
    const price = p.priceIdr ?? 1;
    const valueScore = perf / price; // simple ratio

    return {
      ...p,
      valueScore,
    };
  });

  // Cari best value
  const best = withScore.reduce((acc, curr) =>
    curr.valueScore > acc.valueScore ? curr : acc
  );

  return NextResponse.json({
    items: withScore,
    best,
  });
}
