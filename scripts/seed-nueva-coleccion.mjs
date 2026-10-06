import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

const newProducts = [
  {
    id: 101,
    product_id: 'pack-3-esponjas-variadas',
    nombre: 'Pack de 3 Esponjas Variadas',
    descripcion: 'Pack de 3 esponjas de maquillaje variadas (color al azar o elige tu tono preferido). Suaves, ergonómicas y de alta densidad para una aplicación impecable.',
    precio: '$7.000',
    colores: 'Rosado, Negro, Variado',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Rosado-UNICA': 15, 'Negro-UNICA': 15, 'Variado-UNICA': 20 },
    stock: 50,
    activo: true
  },
  {
    id: 102,
    product_id: 'pack-5-esponjas-variadas',
    nombre: 'Pack de 5 Esponjas Variadas',
    descripcion: 'Pack de 5 esponjas de maquillaje variadas (colores al azar). Diferentes formas y tamaños para base, correctores, polvos y contornos con acabado profesional.',
    precio: '$11.000',
    colores: 'Variado',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Variado-UNICA': 35 },
    stock: 35,
    activo: true
  },
  {
    id: 103,
    product_id: 'pack-6-esponjas-2-monas-satin',
    nombre: 'Pack de 6 Esponjas Variadas + 2 Moñas de Satín',
    descripcion: 'Mega pack: 6 esponjas de maquillaje variadas + 2 moñas de satín suaves para tu cabello (colores al azar). Suaves, prácticas y de gran calidad.',
    precio: '$18.000',
    colores: 'Variado',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Variado-UNICA': 30 },
    stock: 30,
    activo: true
  },
  {
    id: 104,
    product_id: 'pack-3-monas-satin',
    nombre: 'Pack de 3 Moñas de Satín',
    descripcion: 'Set de 3 moñas de satín suaves, prácticas y súper bonitas (colores al azar). Cuidan tu cabello evitando el frizz, el quiebre y las marcas.',
    precio: '$5.500',
    colores: 'Variado',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Variado-UNICA': 40 },
    stock: 40,
    activo: true
  },
  {
    id: 105,
    product_id: 'cosmetiquera-acolchada-premium',
    nombre: 'Cosmetiquera Acolchada',
    descripcion: 'Cosmetiquera con diseño acolchado y moderno. Material suave y resistente, interior amplio y práctico. Disponible en Rosado y Beige.',
    precio: '$22.000',
    colores: 'Rosado, Beige',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Rosado-UNICA': 20, 'Beige-UNICA': 20 },
    stock: 40,
    activo: true
  },
  {
    id: 106,
    product_id: 'combo-cosmetiquera-2-monas-3-esponjas',
    nombre: 'Cosmetiquera + 2 Moñas de Satín + 3 Esponjas',
    descripcion: 'Kit completo de belleza: 1 Cosmetiquera acolchada moderna (elige tono Rosado o Beige) + 2 moñas de satín + 3 esponjas de maquillaje (colores de accesorios al azar).',
    precio: '$33.000',
    colores: 'Rosado, Beige',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Rosado-UNICA': 15, 'Beige-UNICA': 15 },
    stock: 30,
    activo: true
  },
  {
    id: 107,
    product_id: 'esponja-maquillaje-grande',
    nombre: '1 Esponja Grande',
    descripcion: '1 esponja de maquillaje grande de alta densidad. Suave, ergonómica y perfecta para difuminar base y polvos. Elige entre Negro y Rosado.',
    precio: '$2.500',
    colores: 'Rosado, Negro',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Rosado-UNICA': 30, 'Negro-UNICA': 30 },
    stock: 60,
    activo: true
  },
  {
    id: 108,
    product_id: 'esponja-maquillaje-pequena',
    nombre: '1 Esponja Pequeña (Mini)',
    descripcion: '1 esponja de maquillaje versión mini. Precisión ideal para zona de ojeras, aletas de la nariz y detalles finos. Elige entre Negro y Rosado.',
    precio: '$1.000',
    colores: 'Negro, Rosado',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: { 'Negro-UNICA': 30, 'Rosado-UNICA': 30 },
    stock: 60,
    activo: true
  },
  {
    id: 109,
    product_id: 'mona-satin-cabello',
    nombre: '1 Moña de Satín',
    descripcion: '1 moña de satín suave para tu cabello. Cómoda, práctica y súper delicada. Protege tu pelo del quiebre y el frizz.',
    precio: '$2.500',
    colores: 'Negro, Blanco, Fucsia, Rosado, Morado, Lila, Azul, Celeste, Verde, Cafe, Beige, Naranja, Amarillo, Vinotinto',
    tallas: 'UNICA',
    genero: 'accesorios',
    categoria: 'Cosmetica',
    image_paths: [],
    unidades: {
      'Negro-UNICA': 10,
      'Blanco-UNICA': 10,
      'Fucsia-UNICA': 10,
      'Rosado-UNICA': 10,
      'Morado-UNICA': 10,
      'Lila-UNICA': 10,
      'Azul-UNICA': 10,
      'Celeste-UNICA': 10,
      'Verde-UNICA': 10,
      'Cafe-UNICA': 10,
      'Beige-UNICA': 10,
      'Naranja-UNICA': 10,
      'Amarillo-UNICA': 10,
      'Vinotinto-UNICA': 10
    },
    stock: 140,
    activo: true
  }
]

async function seed() {
  console.log('Updating 9 beauty products with empty image_paths...')
  for (const prod of newProducts) {
    const { data: existing } = await supabase
      .from('productos')
      .select('id, product_id')
      .eq('product_id', prod.product_id)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precio: prod.precio,
          colores: prod.colores,
          tallas: prod.tallas,
          genero: prod.genero,
          categoria: prod.categoria,
          image_paths: prod.image_paths,
          unidades: prod.unidades,
          stock: prod.stock,
          activo: prod.activo,
          updated_at: new Date().toISOString()
        })
        .eq('product_id', prod.product_id)

      if (error) console.error(`Error updating ${prod.product_id}:`, error.message)
      else console.log(`✓ Updated ${prod.product_id}`)
    } else {
      const { error } = await supabase
        .from('productos')
        .insert({
          ...prod,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('product_id', prod.product_id)

      if (error) console.error(`Error inserting ${prod.product_id}:`, error.message)
      else console.log(`✓ Inserted ${prod.product_id}`)
    }
  }
  console.log('Finished updating beauty products with no images!')
}

seed()
