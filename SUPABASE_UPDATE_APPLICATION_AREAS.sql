-- Atualizar sistema de áreas de aplicação para armazenar array de áreas selecionadas
-- Execute este SQL no Supabase

-- Alterar application_area de TEXT para JSONB para armazenar array de áreas
ALTER TABLE products 
ALTER COLUMN application_area TYPE JSONB USING 
  CASE 
    WHEN application_area IS NULL THEN '[]'::jsonb
    WHEN application_area = '' THEN '[]'::jsonb
    ELSE jsonb_build_array(application_area)
  END;

-- Definir default como array vazio
ALTER TABLE products 
ALTER COLUMN application_area SET DEFAULT '[]'::jsonb;

