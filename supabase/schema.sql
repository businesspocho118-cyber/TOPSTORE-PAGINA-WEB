-- TOPSTORE Supabase schema and RLS policies.
-- Run this once in the Supabase SQL editor for the new project.

CREATE TABLE IF NOT EXISTS productos (
  id           SERIAL PRIMARY KEY,
  product_id   TEXT UNIQUE NOT NULL,
  nombre       TEXT NOT NULL,
  descripcion  TEXT,
  precio       TEXT NOT NULL,
  colores      TEXT,
  genero       TEXT NOT NULL CHECK (genero IN ('hombres', 'mujeres', 'accesorios', 'unisex')),
  categoria    TEXT,
  image_paths  JSONB DEFAULT '[]',
  stock        INTEGER DEFAULT 0,
  activo       BOOLEAN DEFAULT TRUE,
  tallas       TEXT,
  unidades     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
  id                  BIGINT PRIMARY KEY,
  nombre              TEXT NOT NULL,
  telefono            TEXT,
  direccion           TEXT,
  referencias         TEXT,
  ultimo_metodo_pago  TEXT,
  compras             INTEGER DEFAULT 0,
  nivel_fidelidad     TEXT GENERATED ALWAYS AS (
    CASE
      WHEN compras >= 7 THEN 'Gold'
      WHEN compras >= 4 THEN 'Silver'
      WHEN compras >= 1 THEN 'Active'
      ELSE 'New'
    END
  ) STORED,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id                  BIGINT PRIMARY KEY DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  fecha               TIMESTAMPTZ DEFAULT NOW(),
  cliente_id          BIGINT REFERENCES clientes(id),
  cliente_nombre      TEXT NOT NULL,
  cliente_telefono    TEXT,
  cliente_direccion   TEXT,
  cliente_barrio      TEXT,
  cliente_referencias TEXT,
  metodo_pago         TEXT CHECK (metodo_pago IN ('efectivo', 'transferencia') OR metodo_pago IS NULL),
  estado              TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'entregado', 'cancelado')),
  total               NUMERIC(12,2),
  notas               TEXT,
  items               JSONB DEFAULT '[]'
);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Productos activos visibles" ON productos;
CREATE POLICY "Productos activos visibles" ON productos
  FOR SELECT USING (activo = TRUE);

DROP POLICY IF EXISTS "Insertar pedidos" ON pedidos;
CREATE POLICY "Insertar pedidos" ON pedidos
  FOR INSERT WITH CHECK (TRUE);
