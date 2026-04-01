// src/scripts/scrapeCpu.ts
import * as cheerio from 'cheerio'
import { prisma } from '@/lib/prisma'
import { detectBrand, slugify } from '@/lib/slugify'

async function main() {
  const res = await fetch('https://www.cpubenchmark.net/common_cpus.html', {
    headers: { 'user-agent': 'Mozilla/5.0' }
  })

  if (!res.ok) {
    throw new Error(`Failed CPU page: ${res.status}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const rows: { model: string; benchmark: number | null }[] = []

  $('table tbody tr').each((_, tr) => {
    const tds = $(tr).find('td')
    const model = $(tds[0]).text().trim()
    const scoreText = $(tds[1]).text().trim().replace(/,/g, '')
    const benchmark = Number(scoreText)

    if (model) {
      rows.push({
        model,
        benchmark: Number.isFinite(benchmark) ? benchmark : null
      })
    }
  })

  for (const row of rows) {
    await prisma.cPU.upsert({
      where: { slug: slugify(row.model) },
      update: {
        brand: detectBrand(row.model),
        model: row.model,
        benchmark: row.benchmark
      },
      create: {
        brand: detectBrand(row.model),
        model: row.model,
        slug: slugify(row.model),
        benchmark: row.benchmark
      }
    })
  }

  console.log(`Upserted ${rows.length} CPUs`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })