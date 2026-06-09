export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ProductGender = 'hombres' | 'mujeres' | 'accesorios' | 'unisex'

export type ProductRecord = {
  id: number
  product_id: string
  nombre: string
  descripcion: string | null
  precio: string
  colores: string | null
  genero: ProductGender
  categoria: string | null
  image_paths: string[] | Record<string, string[]> | null
  stock: number | null
  activo: boolean | null
  tallas: string | null
  unidades: Record<string, number> | null
  created_at: string | null
  updated_at: string | null
}

export type ClienteRecord = {
  id: number
  nombre: string
  telefono: string | null
  direccion: string | null
  referencias: string | null
  ultimo_metodo_pago: string | null
  compras: number | null
  nivel_fidelidad: 'Gold' | 'Silver' | 'Active' | 'New'
  created_at: string | null
}

export type PedidoRecord = {
  id: number
  fecha: string | null
  cliente_id: number | null
  cliente_nombre: string
  cliente_telefono: string | null
  cliente_direccion: string | null
  cliente_barrio: string | null
  cliente_referencias: string | null
  metodo_pago: 'efectivo' | 'transferencia' | null
  estado: 'pendiente' | 'entregado' | 'cancelado' | null
  total: number | null
  notas: string | null
  items: Json[] | null
}

export type Database = {
  public: {
    Tables: {
      productos: {
        Row: ProductRecord
        Insert: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<ProductRecord, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<ProductRecord>
      }
      clientes: {
        Row: ClienteRecord
        Insert: Omit<ClienteRecord, 'nivel_fidelidad' | 'created_at'> & Partial<Pick<ClienteRecord, 'nivel_fidelidad' | 'created_at'>>
        Update: Partial<Omit<ClienteRecord, 'nivel_fidelidad'>>
      }
      pedidos: {
        Row: PedidoRecord
        Insert: Omit<PedidoRecord, 'id' | 'fecha'> & Partial<Pick<PedidoRecord, 'id' | 'fecha'>>
        Update: Partial<PedidoRecord>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
