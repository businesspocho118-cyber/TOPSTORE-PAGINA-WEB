import fs from 'node:fs/promises'
import path from 'node:path'

const workspaceRoot = process.cwd()
const sourceRoot = 'C:\\Users\\JOHANPRO\\Desktop\\FOTOS PRENDAS NUEVO'
const publicRoot = path.join(workspaceRoot, 'public')
const targetRoot = path.join(publicRoot, 'product-color-images')
const generatedFile = path.join(workspaceRoot, 'lib', 'generated', 'product-color-image-manifest.ts')
const reportFile = path.join(targetRoot, '_report.json')

const folderToProductId = new Map(Object.entries({
  'HOMBRES/buzo compresor hombre': 'buzo-compresor-hombre',
  'HOMBRES/camiseta compresora hombre': 'camisa-compresora-sencillas',
  'HOMBRES/camiseta own it hombre': 'camisa-own-it',
  'HOMBRES/camiseta sin mangas con capucha hombre': 'buzo-sin-manga-hombre',
  'HOMBRES/camiseta sin mangas deportiva hombre': 'camisa-alpha',
  'HOMBRES/Camiseta sin mangas I DONT CARE': 'camisa-i-dont-care',
  'HOMBRES/camiseta sin mangas rayo hombre': 'sin-manga-doble-lineas',
  'HOMBRES/camiseta sin mangas workout hombre': 'camisa-workout',
  'HOMBRES/camiseta tirantes': 'camisa-tirantes',
  'HOMBRES/chaqueta deportiva hombre': 'chaqueta-deportiva-larga',

  'MUJERES/Camiseta': 'camisa-compresora-mujer',
  'MUJERES/chaqueta compresora con cierre mujer': 'chaqueta-mujer',
  'MUJERES/Chaqueta delgada': 'chaqueta-elastica',
  'MUJERES/Conjunto con leggins': 'conjunto-leggins',
  'MUJERES/Conjunto con leggins Botacampana': 'conjunto-leggins-bota-campana',
  'MUJERES/Conjunto con short sin bolsillo': 'conjunto-short-sin-bolsillos',
  'MUJERES/Conjunto con short y bolsillo': 'conjunto-short-y-bolsillos',
  'MUJERES/Conjunto con top': 'conjunto-top',
  'MUJERES/Conjunto con top halter': 'conjunto-con-top-halter',
  'MUJERES/Enterizo': 'enterizo-mujer',
  'MUJERES/Enterizo Completo': 'enterizo-completo',
  'MUJERES/Enterizo Corto': 'enterizo-corto',
  'MUJERES/Enterizos Abierto Espalda': 'enterizo-abierto-espalda',
  'MUJERES/Leggins botacampana': 'leggin-bota-campana',
  'MUJERES/Leggins push up': 'leggings',
  'MUJERES/Medias': 'medias',
  'MUJERES/Short push up': 'short-push-up-corte-en-v',
  'MUJERES/top deportivo cruzado mujer': 'top-deportivo',
  'MUJERES/Tops Deportivos': 'top-deportivo',
  'MUJERES/Tops': 'tops-nuevos',
}))

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const ignoredPathParts = new Set(['accesorios', 'Enterizo NUEVO TESTTTT'])

function stripAccents(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function cleanColorLabel(value) {
  return String(value).replace(/#[0-9a-fA-F]{3,8}/g, '').trim().replace(/\s+/g, ' ')
}

function normalizeColorKey(value) {
  return stripAccents(cleanColorLabel(value)).toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function slugify(value) {
  return stripAccents(String(value)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'image'
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function listDirectories(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

async function listImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort(compareImageFiles)
}

function imageSideRank(fileName) {
  const normalized = stripAccents(fileName).toLowerCase()
  const frontIndexes = ['frontal', 'frente', 'adelante']
    .map((token) => normalized.indexOf(token))
    .filter((index) => index >= 0)
  const backIndexes = ['espaldas', 'espalda', 'atras']
    .map((token) => normalized.indexOf(token))
    .filter((index) => index >= 0)
  const firstFrontIndex = Math.min(...frontIndexes)
  const firstBackIndex = Math.min(...backIndexes)
  const hasFront = Number.isFinite(firstFrontIndex)
  const hasBack = Number.isFinite(firstBackIndex)

  if (hasFront && hasBack) return firstFrontIndex < firstBackIndex ? 0 : 1
  if (hasFront) return 0
  if (hasBack) return 1
  if (normalized.includes('lateral')) return 2
  if (normalized.includes('set')) return 3
  return 4
}

function compareImageFiles(a, b) {
  const rankDiff = imageSideRank(a) - imageSideRank(b)
  if (rankDiff !== 0) return rankDiff
  return a.localeCompare(b, 'es')
}

function toPublicPath(absPath) {
  const relative = path.relative(publicRoot, absPath).split(path.sep).join('/')
  return `/${relative}`
}

function assertSafeTarget() {
  const resolvedTarget = path.resolve(targetRoot)
  const resolvedPublic = path.resolve(publicRoot)
  if (!resolvedTarget.startsWith(resolvedPublic + path.sep)) {
    throw new Error(`Refusing to write outside public/: ${resolvedTarget}`)
  }
}

async function main() {
  assertSafeTarget()

  if (!(await exists(sourceRoot))) {
    throw new Error(`Source image folder not found: ${sourceRoot}`)
  }

  await fs.rm(targetRoot, { recursive: true, force: true })
  await fs.mkdir(targetRoot, { recursive: true })
  await fs.mkdir(path.dirname(generatedFile), { recursive: true })

  const manifest = {}
  const report = {
    sourceRoot,
    targetRoot,
    ignored: ['accesorios', 'MUJERES/Enterizo NUEVO TESTTTT'],
    copiedImageCount: 0,
    mappedVariantCount: 0,
    mappedProductCount: 0,
    mappedFolders: [],
    skippedFolders: [],
  }

  for (const gender of await listDirectories(sourceRoot)) {
    if (ignoredPathParts.has(gender)) {
      report.skippedFolders.push({ folder: gender, reason: 'ignored-by-plan' })
      continue
    }

    const genderDir = path.join(sourceRoot, gender)
    for (const productFolder of await listDirectories(genderDir)) {
      if (ignoredPathParts.has(productFolder)) {
        report.skippedFolders.push({ folder: `${gender}/${productFolder}`, reason: 'ignored-by-plan' })
        continue
      }

      const relativeProductFolder = `${gender}/${productFolder}`
      const productId = folderToProductId.get(relativeProductFolder)
      if (!productId) {
        report.skippedFolders.push({ folder: relativeProductFolder, reason: 'no-product-id-mapping' })
        continue
      }

      const productDir = path.join(genderDir, productFolder)
      for (const colorFolder of await listDirectories(productDir)) {
        const colorDir = path.join(productDir, colorFolder)
        const imageFiles = await listImageFiles(colorDir)
        if (imageFiles.length === 0) {
          report.skippedFolders.push({ folder: `${relativeProductFolder}/${colorFolder}`, reason: 'no-supported-images' })
          continue
        }

        const colorSlug = slugify(colorFolder)
        const productTargetDir = path.join(targetRoot, productId, colorSlug)
        await fs.mkdir(productTargetDir, { recursive: true })

        const copiedImages = []
        for (const [index, fileName] of imageFiles.entries()) {
          const ext = path.extname(fileName).toLowerCase()
          const fileSlug = slugify(path.basename(fileName, ext))
          const targetName = `${String(index + 1).padStart(2, '0')}-${fileSlug}${ext}`
          const targetPath = path.join(productTargetDir, targetName)
          await fs.copyFile(path.join(colorDir, fileName), targetPath)
          copiedImages.push(toPublicPath(targetPath))
          report.copiedImageCount += 1
        }

        manifest[productId] ??= {}
        manifest[productId][normalizeColorKey(colorFolder)] = {
          productId,
          productFolder,
          colorLabel: colorFolder,
          colorKey: normalizeColorKey(colorFolder),
          images: copiedImages,
        }
        report.mappedVariantCount += 1
        report.mappedFolders.push({
          productId,
          folder: `${relativeProductFolder}/${colorFolder}`,
          color: colorFolder,
          images: copiedImages.length,
        })
      }
    }
  }

  report.mappedProductCount = Object.keys(manifest).length

  const ts = `// AUTO-GENERATED by scripts/sync-product-color-images.mjs. Do not edit by hand.\n\nexport type ProductColorImageVariant = {\n  productId: string\n  productFolder: string\n  colorLabel: string\n  colorKey: string\n  images: string[]\n}\n\nexport const productColorImageManifest = ${JSON.stringify(manifest, null, 2)} as const satisfies Record<string, Record<string, ProductColorImageVariant>>\n\nexport const productColorImageReport = ${JSON.stringify(report, null, 2)} as const\n`

  await fs.writeFile(generatedFile, ts, 'utf8')
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8')

  console.log(JSON.stringify({
    copiedImageCount: report.copiedImageCount,
    mappedVariantCount: report.mappedVariantCount,
    mappedProductCount: report.mappedProductCount,
    reportFile: toPublicPath(reportFile),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
