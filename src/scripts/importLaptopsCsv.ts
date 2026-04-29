import fs from 'node:fs'
import { parse } from 'csv-parse/sync'
import { prisma } from '@/lib/prisma'
import {
  detectBrand,
  parseNumber,
  parseResolution,
  parseStorage,
  slugify
} from '@/lib/slugify'

const filePath = process.argv[2]

if (!filePath) {
  throw new Error('Usage: tsx src/scripts/importLaptopsCsv.ts path/to/laptops.csv')
}

const raw = fs.readFileSync(filePath, 'utf8')
const rows = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  bom: true
}) as Record<string, string>[]

const INR_TO_IDR = Number(process.env.INR_TO_IDR || '190')

function pick(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    if (row[key]) return row[key]
  }
  return null
}

async function upsertCpu(model?: string | null) {
  if (!model) return null

  return prisma.cPU.upsert({
    where: { slug: slugify(model) },
    update: {
      brand: detectBrand(model),
      model
    },
    create: {
      brand: detectBrand(model),
      model,
      slug: slugify(model)
    }
  })
}

async function upsertGpu(model?: string | null) {
  if (!model) return null

  return prisma.gPU.upsert({
    where: { slug: slugify(model) },
    update: {
      brand: detectBrand(model),
      model
    },
    create: {
      brand: detectBrand(model),
      model,
      slug: slugify(model)
    }
  })
}

async function main() {
  for (const row of rows) {
    const brand = pick(row, ['brand']) || 'Unknown'
    const model = pick(row, ['name']) || 'Unknown Laptop'
    const cpuModel = pick(row, ['processor'])
    const gpuModel = pick(row, ['graphics'])
    const ramGb = parseNumber(pick(row, ['ram']))
    const memory = pick(row, ['storage'])
    const { storageGb } = parseStorage(memory)
    const inches = parseNumber(pick(row, ['screen_size']))
    const resolution = parseResolution(pick(row, ['resoultion']))
    const rawPrice = pick(row, ['price'])
    const batteryWh = null
    const batteryHours = null
    const panelType = null
    const refreshRate = null
    const imageUrl = pick(row, ['image_url']) || null

    const priceNum = parseNumber(rawPrice)
    const priceIdr = priceNum ? Math.round(priceNum * INR_TO_IDR) : null

    const cpu = await upsertCpu(cpuModel)
    const gpu = await upsertGpu(gpuModel)

    await prisma.laptop.upsert({
      where: { slug: slugify(`${brand}-${model}`) },
      update: {
        brand,
        model,
        cpuId: cpu?.id,
        gpuId: gpu?.id,
        ramGb,
        storageGb,
        batteryWh,
        batteryHours,
        priceIdr,
        imageUrl,
        screenSizeInch: inches,
        screenResolutionX: resolution.x,
        screenResolutionY: resolution.y,
        screenPanelType: panelType,
        screenRefreshRateHz: refreshRate
      },
      create: {
        brand,
        model,
        slug: slugify(`${brand}-${model}`),
        cpuId: cpu?.id,
        gpuId: gpu?.id,
        ramGb,
        storageGb,
        batteryWh,
        batteryHours,
        priceIdr,
        imageUrl,
        screenSizeInch: inches,
        screenResolutionX: resolution.x,
        screenResolutionY: resolution.y,
        screenPanelType: panelType,
        screenRefreshRateHz: refreshRate
      }
    })
  }

  console.log(`Imported ${rows.length} laptops`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })