# Configuração de Variável de Ambiente para Verificação de Email

## Como Adicionar Variável de Ambiente no Netlify (Plano Gratuito)

Você precisa adicionar a variável de ambiente **no nível do projeto**, não no nível do time.

### Passos:

1. **Acesse seu projeto no Netlify:**
   - Vá para https://app.netlify.com
   - Clique no seu projeto (não em Team settings)

2. **Vá em Site settings:**
   - Clique no nome do seu projeto
   - Vá em **Site settings** (ou **Configurações do site**)
   - No menu lateral, encontre **Environment variables** (ou **Variáveis de ambiente**)

3. **Adicione a variável:**
   - Clique em **Add a variable** (Adicionar variável)
   - **Key:** `ABSTRACT_API_KEY` ou `EMAIL_VALIDATION_API_KEY`
   - **Value:** Sua chave da API
   - Selecione os ambientes (Production, Deploy previews, Branch deploys)
   - Clique em **Save**

### Obtendo uma Chave de API Gratuita:

**Opção 1: Abstract API** (Recomendado - Plano gratuito com 100 verificações/mês)
1. Acesse: https://www.abstractapi.com/api/email-validation
2. Clique em "Get Started" ou "Sign Up"
3. Crie uma conta gratuita
4. Copie sua API Key do dashboard
5. Adicione como variável de ambiente no Netlify

**Opção 2: MailboxValidator** (Alternativa)
1. Acesse: https://www.mailboxvalidator.com/
2. Crie uma conta gratuita
3. Obtenha sua API key
4. Adicione como variável no Netlify (será necessário ajustar o código)

### Importante:

- A verificação de email funcionará **mesmo sem a chave configurada**, mas de forma básica (só verifica formato e domínios comuns)
- Com a API configurada, a verificação será mais rigorosa e confirmará se o email realmente existe

### Alternativa Sem API:

Se preferir não usar API externa, o sistema já funciona com verificação básica:
- Verifica formato do email
- Verifica domínios comuns (gmail.com, yahoo.com, etc.)
- Aceita qualquer email com formato válido

