-- ============================================================
-- COMANDOS SQL PARA ADICIONAR CAMPOS DE IMAGENS DE DOCUMENTOS NA TABELA USERS
-- ============================================================
-- Execute este SQL no SQL Editor do Supabase (https://app.supabase.com)
-- Copie e cole todo o conteúdo abaixo e execute

-- 1. Adicionar campo 'diploma_image' (TEXT) para armazenar a imagem do diploma em base64
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS diploma_image TEXT;

-- 2. Adicionar campo 'council_card_image' (TEXT) para armazenar a imagem da carteira do conselho em base64
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS council_card_image TEXT;

-- 3. Adicionar campo 'council_number' (VARCHAR) para armazenar o número do conselho
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS council_number VARCHAR(32);

-- ============================================================
-- VERIFICAÇÃO (Execute para verificar se funcionou)
-- ============================================================

-- Verificar se os campos foram criados:
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('diploma_image', 'council_card_image', 'council_number');

-- Verificar alguns usuários para ver os dados:
SELECT 
    id, 
    email, 
    name,
    CASE 
        WHEN diploma_image IS NOT NULL THEN 'Sim (' || LENGTH(diploma_image) || ' caracteres)'
        ELSE 'Não'
    END as tem_diploma,
    CASE 
        WHEN council_card_image IS NOT NULL THEN 'Sim (' || LENGTH(council_card_image) || ' caracteres)'
        ELSE 'Não'
    END as tem_carteira,
    council_number
FROM users 
ORDER BY created_at DESC
LIMIT 5;

