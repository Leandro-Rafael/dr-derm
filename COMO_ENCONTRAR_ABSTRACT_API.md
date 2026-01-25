# Como Encontrar Email Validation API na Abstract API

## Problema: Não aparece no menu mobile

A Email Validation API pode estar em outra seção ou só aparecer no desktop. Vamos encontrá-la!

## Método 1: Acessar Diretamente pelo Desktop

1. **Abra no computador** (não celular):
   - https://app.abstractapi.com/

2. **Procure na busca:**
   - No topo do dashboard, há uma barra de busca
   - Digite: **"email validation"** ou **"email verification"**
   - Deve aparecer nas opções

## Método 2: Ver Todas as APIs

1. No dashboard, procure por:
   - **"Browse APIs"** ou **"All APIs"** ou **"Explore APIs"**
   - Ou no menu lateral, procure **"APIs"**

2. Procure na lista completa:
   - Pode estar em seções como:
     - "Data Validation"
     - "Email Tools"
     - "Developer Tools"

## Método 3: Acessar Via Link Direto

Tente acessar diretamente:

- **Dashboard direto:** https://app.abstractapi.com/api/email-validation
- **Página da API:** https://www.abstractapi.com/api/email-validation

Se pedir login, faça login e deve redirecionar para a página da API.

## Método 4: Verificar se Está Ativada

1. No dashboard, vá em:
   - **"Account"** ou **"Settings"** ou **"My Account"**
   - Procure por **"API Keys"** ou **"Active APIs"**
   - Veja se "Email Validation" está listada lá

## Método 5: Criar Nova Chave

Se encontrar a API mas não tiver chave:

1. Vá na página da Email Validation API
2. Procure por **"Get API Key"** ou **"Generate Key"**
3. Clique para gerar uma nova chave
4. Copie a chave gerada

## Se Ainda Não Encontrar:

### Alternativa A: Verificar Plano da Conta

1. Vá em **"Account"** → **"Billing"** ou **"Plan"**
2. Verifique se está no plano **Free**
3. Algumas APIs podem não estar disponíveis no free
4. Email Validation API **deve** estar no free

### Alternativa B: Contatar Suporte

Se não encontrar mesmo assim:
1. Vá em: https://www.abstractapi.com/support
2. Pergunte: "Como acessar Email Validation API no plano gratuito?"
3. Ou use o chat ao vivo (se disponível)

### Alternativa C: Usar Outra Conta

Se tiver outra conta email (mesmo que gratuito), tente criar conta nova:
1. Use um email diferente
2. Crie nova conta na Abstract API
3. Veja se a API aparece na nova conta

## Depois de Encontrar:

1. **Copie a API Key** (string de 32 caracteres)
2. **Adicione no Netlify:**
   - Variável: `ABSTRACT_API_KEY` ou `EMAIL_VALIDATION_API_KEY`
   - Valor: sua chave
3. **Faça deploy:**
   ```powershell
   netlify deploy --prod
   ```

## Importante:

- ✅ A Email Validation API **deve** estar disponível no plano gratuito
- ✅ Se não aparecer, pode ser problema de interface ou conta
- ✅ Tente acessar pelo desktop ao invés do mobile
- ✅ Use a busca ou links diretos acima

