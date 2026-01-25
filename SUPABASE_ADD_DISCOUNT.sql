-- Adicionar campo de desconto na tabela products
-- Execute este SQL no Supabase

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);

-- Se original_price for NULL e discount_percentage > 0, usar price como original_price
UPDATE products 
SET original_price = price 
WHERE discount_percentage > 0 AND original_price IS NULL;

