-- Adicionar campos de imagens e posições de crop na tabela products
-- Execute este SQL no SQL Editor do Supabase

-- 1. Adicionar campo images (JSONB) para múltiplas imagens (até 3)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Adicionar campo image_crop_positions (JSONB) para posições de crop das imagens
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_crop_positions JSONB DEFAULT '[]'::jsonb;

-- 3. Migrar image_url existente para images (primeiro item do array) se images estiver vazio
UPDATE products 
SET images = CASE 
    WHEN image_url IS NOT NULL AND image_url != '' AND (images = '[]'::jsonb OR images IS NULL) 
    THEN jsonb_build_array(image_url)
    WHEN images IS NULL THEN '[]'::jsonb
    ELSE images
END
WHERE (images = '[]'::jsonb OR images IS NULL) AND image_url IS NOT NULL AND image_url != '';

-- 4. Garantir que image_crop_positions tenha valores padrão para produtos existentes
UPDATE products 
SET image_crop_positions = CASE 
    WHEN image_crop_positions IS NULL OR image_crop_positions = '[]'::jsonb THEN
        -- Criar array de posições padrão baseado no número de imagens
        (
            SELECT jsonb_agg(jsonb_build_object('x', 50, 'y', 50))
            FROM jsonb_array_elements(
                CASE 
                    WHEN images IS NOT NULL AND jsonb_array_length(images) > 0 THEN images
                    ELSE '[]'::jsonb
                END
            )
        )
    ELSE image_crop_positions
END
WHERE image_crop_positions IS NULL OR image_crop_positions = '[]'::jsonb;

-- 5. Garantir que o campo image_url seja atualizado automaticamente com a primeira imagem
-- (Isso é feito pelo backend, mas podemos criar uma função para manter sincronizado)
CREATE OR REPLACE FUNCTION sync_image_url_from_images()
RETURNS TRIGGER AS $$
BEGIN
    -- Se images não estiver vazio, atualizar image_url com a primeira imagem
    IF NEW.images IS NOT NULL AND jsonb_array_length(NEW.images) > 0 THEN
        NEW.image_url := NEW.images->>0;
    ELSIF NEW.image_url IS NULL OR NEW.image_url = '' THEN
        NEW.image_url := NULL;
    END IF;
    
    -- Garantir que image_crop_positions tenha o mesmo número de elementos que images
    IF NEW.images IS NOT NULL THEN
        DECLARE
            images_count INTEGER;
            positions_count INTEGER;
            default_position JSONB := jsonb_build_object('x', 50, 'y', 50);
        BEGIN
            images_count := jsonb_array_length(NEW.images);
            
            IF NEW.image_crop_positions IS NULL THEN
                NEW.image_crop_positions := '[]'::jsonb;
            END IF;
            
            positions_count := jsonb_array_length(NEW.image_crop_positions);
            
            -- Se tiver mais imagens que posições, adicionar posições padrão
            IF images_count > positions_count THEN
                FOR i IN positions_count..images_count - 1 LOOP
                    NEW.image_crop_positions := NEW.image_crop_positions || jsonb_build_array(default_position);
                END LOOP;
            -- Se tiver mais posições que imagens, remover posições extras
            ELSIF positions_count > images_count THEN
                NEW.image_crop_positions := (
                    SELECT jsonb_agg(pos)
                    FROM jsonb_array_elements(NEW.image_crop_positions) WITH ORDINALITY AS t(pos, idx)
                    WHERE idx <= images_count
                );
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para sincronizar image_url e image_crop_positions automaticamente
DROP TRIGGER IF EXISTS sync_image_fields_trigger ON products;
CREATE TRIGGER sync_image_fields_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION sync_image_url_from_images();

-- 7. Verificar se os campos foram criados corretamente
-- Execute esta query para verificar:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name IN ('images', 'image_crop_positions', 'image_url');

-- 8. Verificar produtos existentes
-- SELECT id, name, image_url, images, image_crop_positions 
-- FROM products 
-- LIMIT 5;

