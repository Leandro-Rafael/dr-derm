-- Adicionar campos necessários
-- Execute este SQL no Supabase

-- Adicionar campo is_blocked na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- Adicionar campo is_active na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Atualizar produtos sem categoria para is_active = false
UPDATE products 
SET is_active = FALSE 
WHERE category_id IS NULL;

