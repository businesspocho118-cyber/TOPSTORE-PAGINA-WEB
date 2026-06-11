import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function parsePriceToNumber(precio: string): number {
  return Number(String(precio).replace(/[^0-9]/g, ''))
}

export type ColorOption = {
  label: string
  value: string
  swatch: string
  hex?: string
}

const namedColors: Record<string, string> = {
  negro: '#050505',
  blanco: '#ffffff',
  azul: '#2563eb',
  azulmarino: '#1e3a5f',
  azuloscuro: '#1e3a8a',
  rojo: '#dc2626',
  verde: '#16a34a',
  verdeclaro: '#86efac',
  gris: '#9ca3af',
  grisclaro: '#D3D3D3',
  grisoscuro: '#5E5E5E',
  rosado: '#f472b6',
  rosa: '#f472b6',
  fucsia: '#ff00ff',
  morado: '#7c3aed',
  uva: '#8B008B',
  lila: '#a78bfa',
  vinotinto: '#7f1d1d',
  burdeos: '#7f1d1d',
  amarillo: '#facc15',
  naranja: '#f97316',
  celeste: '#b3ebf2',
  cafe: '#7c4a2d',
  marron: '#7c4a2d',
  cafesuave: '#b08a65',
  camel: '#C19A6B',
  beige: '#d6b98c',
  dorado: '#d4af37',
  plateado: '#c0c0c0',
  packde3: '#e879a6',
  multicolor: '#d4af37',
  surtidos: '#d4af37'
}

function stripAccents(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function cleanColorLabel(value: string) {
  return value.replace(/#[0-9a-fA-F]{3,8}/g, '').trim().replace(/\s+/g, ' ')
}

function colorValueWithHex(label: string, hex?: string | null) {
  const clean = cleanColorLabel(label)
  const safeHex = typeof hex === 'string' ? hex.match(/#[0-9a-fA-F]{3,8}/)?.[0] : undefined
  return safeHex ? `${clean} ${safeHex}` : clean
}

function normalizeStockPart(value: string) {
  return stripAccents(cleanColorLabel(String(value)))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function normalizeStockKey(value: string) {
  return stripAccents(cleanColorLabel(String(value)))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getUnitQuantity(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of ['cantidad', 'stock', 'unidades', 'quantity', 'qty']) {
      const qty = getUnitQuantity(record[key])
      if (qty !== null) return qty
    }
  }
  return null
}

export function parseColors(colores: string | null): ColorOption[] {
  if (!colores) return []

  try {
    const parsed = JSON.parse(colores)
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === 'string') return parseColors(item)[0]
          if (!item || typeof item !== 'object') return null
          const record = item as Record<string, unknown>
          const rawLabel = String(record.label ?? record.nombre ?? record.name ?? record.value ?? '').trim()
          if (!rawLabel) return null
          const rawHex = String(record.swatch ?? record.hex ?? record.color ?? '')
          const hex = rawHex.match(/#[0-9a-fA-F]{3,8}/)?.[0]
          const label = cleanColorLabel(rawLabel)
          const normalized = normalizeStockPart(label)
          const swatch = hex ?? namedColors[normalized] ?? '#d6d3d1'
          return { label, value: colorValueWithHex(rawLabel, hex), swatch, hex }
        })
        .filter(Boolean) as ColorOption[]
    }
  } catch {
    // Use comma-separated parsing below.
  }

  return colores
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const hex = raw.match(/#[0-9a-fA-F]{3,8}/)?.[0]
      const label = cleanColorLabel(raw) || raw
      const normalized = normalizeStockPart(label)
      return {
        label,
        value: colorValueWithHex(raw, hex),
        swatch: hex ?? namedColors[normalized] ?? '#d6d3d1',
        hex
      }
    })
}

export function parseSizes(tallas: string | null): string[] {
  if (!tallas) return []
  try {
    const parsed = JSON.parse(tallas)
    if (Array.isArray(parsed)) return parsed.map(String).map((size) => size.trim()).filter(Boolean)
  } catch {
    // Use comma-separated parsing below.
  }
  return tallas.split(',').map((size) => size.trim()).filter(Boolean)
}

export function getProductImages(product: { image_paths?: string[] | Record<string, string[]> | null }): string[] {
  if (!product.image_paths) return []
  if (Array.isArray(product.image_paths)) return product.image_paths.filter(Boolean)
  // New structured format: flatten all color images
  return Object.values(product.image_paths).flat().filter(Boolean)
}

export function getFirstImage(product: { image_paths?: string[] | Record<string, string[]> | null }): string | null {
  return getProductImages(product)[0] ?? null
}

export function getImagesForColor(
  product: { image_paths?: string[] | Record<string, string[]> | null },
  colorLabel: string
): string[] {
  if (!product.image_paths) return []

  // New structured format: { "negro": [...], "azul-oscuro": [...] }
  if (!Array.isArray(product.image_paths)) {
    const colorKey = normalizeStockPart(colorLabel)
    // Direct match first (no hyphens: "azuloscuro")
    if (product.image_paths[colorKey]) return product.image_paths[colorKey] ?? []
    // Fallback: find by normalizing all keys (handles "azul-oscuro", "azul_oscuro", etc.)
    const matchKey = Object.keys(product.image_paths).find(
      (key) => normalizeStockPart(key) === colorKey
    )
    return matchKey ? (product.image_paths[matchKey] ?? []) : []
  }

  // Legacy flat array: try to extract color from URL path segments
  const colorKey = normalizeStockPart(colorLabel)
  return product.image_paths.filter((url) => {
    const segs = url.replace(/\/+$/, "").split("/")
    const parentDir = segs.length >= 2 ? normalizeStockPart(segs[segs.length - 2]) : ""
    return parentDir === colorKey
  })
}

export function getCombinationStock(
  unidades: Record<string, unknown> | null | undefined,
  color: string,
  size: string,
  fallbackStock: number | null | undefined
): number {
  if (!unidades || Object.keys(unidades).length === 0) return fallbackStock ?? 0

  const cleanColor = cleanColorLabel(color)
  const cleanSize = String(size).trim()
  const exactCandidates = [
    `${color}-${cleanSize}`,
    `${color} - ${cleanSize}`,
    `${color}/${cleanSize}`,
    `${color}_${cleanSize}`,
    `${cleanColor}-${cleanSize}`,
    `${cleanColor} - ${cleanSize}`,
    `${cleanColor}/${cleanSize}`,
    `${cleanColor}_${cleanSize}`
  ]

  for (const key of exactCandidates) {
    const qty = getUnitQuantity(unidades[key])
    if (qty !== null) return qty
  }

  const colorKey = normalizeStockPart(cleanColor)
  const sizeKey = normalizeStockPart(cleanSize)
  const wantedKey = normalizeStockKey(`${cleanColor}-${cleanSize}`)

  for (const [key, value] of Object.entries(unidades)) {
    const normalizedKey = normalizeStockKey(key)
    const compactKey = normalizeStockPart(key)
    const matches =
      normalizedKey === wantedKey ||
      compactKey === `${colorKey}${sizeKey}` ||
      (compactKey.includes(colorKey) && compactKey.endsWith(sizeKey))

    if (matches) {
      const qty = getUnitQuantity(value)
      if (qty !== null) return qty
    }
  }

  const nestedColor = Object.entries(unidades).find(([key]) => normalizeStockPart(key) === colorKey)
  if (nestedColor?.[1] && typeof nestedColor[1] === 'object') {
    const nested = nestedColor[1] as Record<string, unknown>
    const nestedSize = Object.entries(nested).find(([key]) => normalizeStockPart(key) === sizeKey)
    const qty = nestedSize ? getUnitQuantity(nestedSize[1]) : null
    if (qty !== null) return qty
  }

  return 0
}

export function getTotalAvailableStock(
  unidades: Record<string, unknown> | null | undefined,
  fallbackStock: number | null | undefined
): number {
  if (!unidades || Object.keys(unidades).length === 0) return fallbackStock ?? 0

  let total = 0
  for (const value of Object.values(unidades)) {
    const direct = getUnitQuantity(value)
    if (direct !== null) {
      total += direct
      continue
    }
    if (value && typeof value === 'object') {
      for (const nestedValue of Object.values(value as Record<string, unknown>)) {
        total += getUnitQuantity(nestedValue) ?? 0
      }
    }
  }

  return total
}
