-- Script para ADICIONAR apenas as tabelas de categorias e marcas
-- Execute APENAS ESTE no Supabase SQL Editor
-- Este script não apaga nada, apenas adiciona o que falta
-- Ignora erros se as coisas já existirem

-- Criar tabela de categorias (se não existir)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de marcas (se não existir)
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas category_id e brand_id na tabela products (se não existirem)
DO $$ 
BEGIN
  -- Adicionar category_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;

  -- Adicionar brand_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'brand_id'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;
  END IF;
END $$;

