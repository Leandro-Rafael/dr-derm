-- Execute este SQL no Supabase SQL Editor para atualizar o banco de dados
-- ATENÇÃO: Este script remove a coluna category antiga e adiciona as novas colunas

-- Remover a coluna category antiga se existir (cuidado: isso remove dados)
ALTER TABLE products DROP COLUMN IF EXISTS category;

-- Adicionar as novas colunas se não existirem
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;

