-- Adicionar suporte para múltiplas imagens (até 3), duração de desconto, e campos de área de aplicação e como usar
-- Execute este SQL no Supabase

-- Múltiplas imagens: alterar image_url para images (JSON array)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Migrar image_url existente para images (primeiro item do array)
UPDATE products 
SET images = CASE 
    WHEN image_url IS NOT NULL AND image_url != '' THEN jsonb_build_array(image_url)
    ELSE '[]'::jsonb
END
WHERE images = '[]'::jsonb OR images IS NULL;

-- Duração do desconto: 'unlimited', 'month', 'week', ou NULL
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_duration VARCHAR(20) CHECK (discount_duration IN ('unlimited', 'month', 'week') OR discount_duration IS NULL);

-- Data de início do desconto (para calcular expiração)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_start_date TIMESTAMP;

-- Área de aplicação do produto
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS application_area TEXT;

-- Como usar o produto
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS how_to_use TEXT;

-- Criar tabela de avaliações de produtos
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_product_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_product_reviews_updated_at_trigger ON product_reviews;

CREATE TRIGGER update_product_reviews_updated_at_trigger
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_reviews_updated_at();

