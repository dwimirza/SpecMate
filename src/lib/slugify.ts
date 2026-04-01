export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function detectBrand(name: string): string {
  const lower = name.toLowerCase()

  if (lower.includes('intel')) return 'Intel'
  if (lower.includes('amd')) return 'AMD'
  if (
    lower.includes('nvidia') ||
    lower.includes('geforce') ||
    lower.includes('quadro') ||
    lower.includes('rtx') ||
    lower.includes('gtx')
  ) return 'NVIDIA'
  if (lower.includes('radeon')) return 'AMD'
  if (lower.includes('apple')) return 'Apple'
  if (lower.includes('qualcomm') || lower.includes('snapdragon')) return 'Qualcomm'
  if (lower.includes('mediatek') || lower.includes('dimensity') || lower.includes('helio')) return 'MediaTek'

  return name.split(' ')[0] || 'Unknown'
}

export function parseNumber(value?: string | null): number | null {
  if (!value) return null
  const match = value.replace(/,/g, '').match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

export function parseStorage(value?: string | null): {
  storageGb: number | null
  storageType: string | null
} {
  if (!value) return { storageGb: null, storageType: null }

  const lower = value.toLowerCase()
  const num = parseNumber(value)
  const storageGb = lower.includes('tb') && num ? num * 1024 : num
  const storageType =
    lower.includes('nvme') ? 'NVME' :
    lower.includes('ssd') ? 'SSD' :
    lower.includes('hdd') ? 'HDD' :
    null

  return { storageGb, storageType }
}

export function parseResolution(value?: string | null): {
  x: number | null
  y: number | null
} {
  if (!value) return { x: null, y: null }

  const match = value.match(/(\d{3,4})\s*[x×]\s*(\d{3,4})/i)
  return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: null, y: null }
}