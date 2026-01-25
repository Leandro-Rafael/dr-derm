-- ============================================================
-- COMANDOS SQL PARA ADICIONAR CAMPOS DE IMAGENS NO BANCO
-- ============================================================
-- Execute este SQL no SQL Editor do Supabase (https://app.supabase.com)
-- Copie e cole todo o conteúdo abaixo e execute

-- 1. Adicionar campo 'images' (JSONB) para armazenar múltiplas imagens (até 3)
-- Este campo aceita arrays de strings (URLs ou Data URLs base64)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Adicionar campo 'image_crop_positions' (JSONB) para armazenar posições de crop das imagens
-- Este campo armazena array de objetos: [{"x": 50, "y": 50}, ...]
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_crop_positions JSONB DEFAULT '[]'::jsonb;

-- 3. Migrar imagens existentes (se houver produtos com image_url mas sem images)
UPDATE products 
SET images = CASE 
    WHEN image_url IS NOT NULL AND image_url != '' AND (images = '[]'::jsonb OR images IS NULL) 
    THEN jsonb_build_array(image_url)
    WHEN images IS NULL THEN '[]'::jsonb
    ELSE images
END
WHERE (images = '[]'::jsonb OR images IS NULL) AND image_url IS NOT NULL AND image_url != '';

-- 4. Criar posições de crop padrão para produtos existentes que têm imagens
UPDATE products 
SET image_crop_positions = (
    SELECT jsonb_agg(jsonb_build_object('x', 50, 'y', 50))
    FROM jsonb_array_elements(
        CASE 
            WHEN images IS NOT NULL AND jsonb_array_length(images) > 0 THEN images
            ELSE '[]'::jsonb
        END
    )
)
WHERE (image_crop_positions IS NULL OR image_crop_positions = '[]'::jsonb) 
  AND images IS NOT NULL 
  AND jsonb_array_length(images) > 0;

-- ============================================================
-- VERIFICAÇÃO (Execute para verificar se funcionou)
-- ============================================================

-- Verificar se os campos foram criados:
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('images', 'image_crop_positions', 'image_url');

-- Verificar alguns produtos para ver as imagens:
SELECT 
    id, 
    name, 
    CASE 
        WHEN LENGTH(image_url) > 100 THEN LEFT(image_url, 100) || '...' 
        ELSE image_url 
    END as image_url_preview,
    jsonb_array_length(images) as images_count,
    jsonb_array_length(image_crop_positions) as crop_positions_count
FROM products 
ORDER BY created_at DESC
LIMIT 5;

