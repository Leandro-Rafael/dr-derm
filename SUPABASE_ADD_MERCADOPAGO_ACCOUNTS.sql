-- Adicionar tabela de contas do MercadoPago
-- Execute este SQL no Supabase SQL Editor
-- NOTA: Se você já executou SUPABASE_SETUP_COMPLETO.sql, este arquivo não é necessário!

-- Tabela de contas do MercadoPago
CREATE TABLE IF NOT EXISTS mercadopago_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  public_key_encrypted TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida de conta ativa
CREATE INDEX IF NOT EXISTS idx_mercadopago_accounts_active ON mercadopago_accounts(is_active) WHERE is_active = TRUE;

-- Trigger para atualizar updated_at (verifica se já existe antes de criar)
DROP TRIGGER IF EXISTS update_mercadopago_accounts_updated_at ON mercadopago_accounts;
CREATE TRIGGER update_mercadopago_accounts_updated_at BEFORE UPDATE ON mercadopago_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
