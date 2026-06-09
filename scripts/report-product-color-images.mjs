import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const workspaceRoot = process.cwd()
const reportFile = path.join(workspaceRoot, 'public', 'product-color-images', '_missing-report.json')
const generatedFile = path.join(workspaceRoot, 'lib', 'generated', 'product-color-image-manifest.ts')

function stripAccents(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function cleanColorLabel(value) {
  return String(value).replace(/#[0-9a-fA-F]{3,8}/g, '').trim().replace(/\s+/g, ' ')
}

function normalizeColorKey(value) {
  return stripAccents(cleanColorLabel(value)).toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function parseColors(colores) {
  if (!colores) return []
  return String(colores)
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const hex = raw.match(/#[0-9a-fA-F]{3,8}/)?.[0]
      const label = cleanColorLabel(raw)
      return { label, value: hex ? `${label} ${hex}` : label, source: 'supabase' }
    })
}

const aliasGroups = [
  ['cafe', 'marron', 'cafesuave'],
  ['uva', 'morado'],
  ['burdeos', 'vinotinto', 'rojo'],
  ['rosado', 'rosada', 'rosa'],
  ['azuloscuro', 'azulmarino'],
  ['verdeclaro', 'verdementa'],
  ['gris', 'grisoscuro', 'grisclaro'],
  ['blanconegro', 'negroblanco'],
]

function lookupKeys(color) {
  const normalized = normalizeColorKey(color)
  const keys = new Set([normalized])

  for (const group of aliasGroups) {
    if (group.includes(normalized)) group.forEach((key) => keys.add(key))
  }

  if (normalized === 'azul') {
    keys.add('azulmarino')
    keys.add('azuloscuro')
  }

  return [...keys]
}

function getVariant(manifest, productId, color) {
  const productVariants = manifest[productId]
  if (!productVariants) return null

  for (const key of lookupKeys(color)) {
    if (productVariants[key]) return productVariants[key]
  }

  return null
}

const hiddenProductColorKeys = {
  'camisa-compresora-mujer': new Set(['rojo']),
  'chaqueta-mujer': new Set(['azuloscuro']),
}

const productColorLabelOverrides = {
  'conjunto-con-top-halter': {
    vinotinto: 'Rojo',
  },
}

function displayColorForProduct(productId, color) {
  const overrides = productColorLabelOverrides[productId] ?? {}
  const label = overrides[normalizeColorKey(color.value)] ?? overrides[normalizeColorKey(color.label)] ?? color.label
  return {
    ...color,
    label,
    imageValue: label,
  }
}

function missingSides(images) {
  let hasFront = false
  let hasBack = false

  for (const image of images) {
    const name = stripAccents(image).toLowerCase()
    const frontIndexes = ['frontal', 'adelante', 'frente']
      .map((token) => name.indexOf(token))
      .filter((index) => index >= 0)
    const backIndexes = ['espaldas', 'espalda', 'atras']
      .map((token) => name.indexOf(token))
      .filter((index) => index >= 0)
    const firstFrontIndex = Math.min(...frontIndexes)
    const firstBackIndex = Math.min(...backIndexes)
    const hasImageFront = Number.isFinite(firstFrontIndex)
    const hasImageBack = Number.isFinite(firstBackIndex)

    if (hasImageFront && hasImageBack) {
      if (firstFrontIndex < firstBackIndex) hasFront = true
      else hasBack = true
      continue
    }

    if (hasImageFront) hasFront = true
    if (hasImageBack) hasBack = true
  }

  const missing = []
  if (!hasFront) missing.push('frontal/adelante')
  if (!hasBack) missing.push('espaldas/atras')
  return missing
}

async function readEnv() {
  const envText = await fs.readFile(path.join(workspaceRoot, '.env.local'), 'utf8')
  return Object.fromEntries(
    envText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=')
        return [line.slice(0, index), line.slice(index + 1).replace(/\s+#.*$/, '').trim()]
      })
  )
}

async function readManifest() {
  const manifestTs = await fs.readFile(generatedFile, 'utf8')
  const marker = 'export const productColorImageManifest = '
  const start = manifestTs.indexOf(marker) + marker.length
  let level = 0
  let end = -1

  for (let index = start; index < manifestTs.length; index += 1) {
    const char = manifestTs[index]
    if (char === '{') level += 1
    if (char === '}') {
      level -= 1
      if (level === 0) {
        end = index + 1
        break
      }
    }
  }

  return JSON.parse(manifestTs.slice(start, end))
}

function visibleColorsForProduct(manifest, product) {
  const hiddenColors = hiddenProductColorKeys[product.product_id] ?? new Set()
  const visible = parseColors(product.colores)
    .filter((color) => !hiddenColors.has(normalizeColorKey(color.label)))
    .map((color) => displayColorForProduct(product.product_id, color))

  for (const variant of Object.values(manifest[product.product_id] ?? {})) {
    if (hiddenColors.has(normalizeColorKey(variant.colorLabel))) continue
    const represented = visible.some((color) => getVariant(manifest, product.product_id, color.imageValue ?? color.value)?.colorKey === variant.colorKey)
    if (!represented) {
      visible.push(displayColorForProduct(product.product_id, {
        label: cleanColorLabel(variant.colorLabel),
        value: cleanColorLabel(variant.colorLabel),
        source: 'local-image',
      }))
    }
  }

  return visible
}

async function main() {
  const env = await readEnv()
  const manifest = await readManifest()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const queryPromise = supabase
    .from('productos')
    .select('product_id,nombre,colores,activo')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  const { data: products, error } = await Promise.race([
    queryPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase query timed out after 30s')), 30_000)),
  ])
  if (error) throw error

  const addedLocalColors = []
  const missing = []

  for (const product of products ?? []) {
    for (const color of visibleColorsForProduct(manifest, product)) {
      if (color.source === 'local-image') {
        addedLocalColors.push({ product_id: product.product_id, prenda: product.nombre, color: color.label })
      }

      const variant = getVariant(manifest, product.product_id, color.imageValue ?? color.value)
      const images = variant?.images ?? []
      const missingPhotoSides = missingSides(images)
      if (images.length < 2 || missingPhotoSides.length > 0) {
        missing.push({
          product_id: product.product_id,
          prenda: product.nombre,
          color: color.label,
          falta: missingPhotoSides.length > 0 ? missingPhotoSides : [`${2 - images.length} foto(s) adicional(es)`],
          fotos_actuales: images.length,
          carpeta_color: variant?.colorLabel ?? null,
          source: color.source,
        })
      }
    }
  }

  addedLocalColors.sort((a, b) => `${a.prenda} ${a.color}`.localeCompare(`${b.prenda} ${b.color}`, 'es'))
  missing.sort((a, b) => `${a.prenda} ${a.color}`.localeCompare(`${b.prenda} ${b.color}`, 'es'))

  const report = {
    generatedAt: new Date().toISOString(),
    requirement: 'Cada color visible de producto debe tener 2 fotos: frontal/adelante y espaldas/atras.',
    activeProductCount: products?.length ?? 0,
    addedLocalColors,
    missing,
    summary: {
      addedLocalColors: addedLocalColors.length,
      variantsWithMissingImages: missing.length,
      missingBothSides: missing.filter((item) => item.falta.length === 2).length,
      missingOneSide: missing.filter((item) => item.falta.length === 1).length,
    },
  }

  await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8')
  console.log(JSON.stringify(report, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

