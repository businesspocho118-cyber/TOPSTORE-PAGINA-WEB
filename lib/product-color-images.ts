import { productColorImageManifest, type ProductColorImageVariant } from '@/lib/generated/product-color-image-manifest'

function stripAccents(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function normalizeColorImageKey(value: string) {
  return stripAccents(String(value))
    .replace(/#[0-9a-fA-F]{3,8}/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

const aliasGroups = [
  ['cafe', 'marron', 'cafesuave'],
  ['uva', 'morado'],
  ['burdeos', 'vinotinto', 'rojo'],
  ['rosado', 'rosada', 'rosa'],
  ['azuloscuro', 'azulmarino'],
  ['verdeclaro', 'verdementa'],
  ['gris', 'grisoscuro', 'grisclaro'],
  ['blanconegro', 'negroblanco', 'blanconegrogris'],
  ['packde3', 'pack3'],
]

function lookupKeys(color: string) {
  const normalized = normalizeColorImageKey(color)
  const keys = new Set([normalized])

  for (const group of aliasGroups) {
    if (group.includes(normalized)) {
      group.forEach((key) => keys.add(key))
    }
  }

  if (normalized === 'azul') {
    keys.add('azulmarino')
    keys.add('azuloscuro')
  }

  return [...keys]
}

export function getProductColorImageVariant(productId: string, color: string): ProductColorImageVariant | null {
  const productVariants = productColorImageManifest[productId as keyof typeof productColorImageManifest]
  if (!productVariants) return null

  for (const key of lookupKeys(color)) {
    const variant = productVariants[key as keyof typeof productVariants]
    if (variant) return variant
  }

  return null
}

export function getProductColorImageVariants(productId: string): ProductColorImageVariant[] {
  const productVariants = productColorImageManifest[productId as keyof typeof productColorImageManifest]
  if (!productVariants) return []

  return Object.values(productVariants).sort((a, b) => a.colorLabel.localeCompare(b.colorLabel, 'es'))
}

export function getProductColorPreviewImages(productId: string): string[] {
  return getProductColorImageVariants(productId).find((variant) => variant.images.length > 0)?.images ?? []
}

export function hasProductColorImageVariants(productId: string) {
  return Boolean(productColorImageManifest[productId as keyof typeof productColorImageManifest])
}
