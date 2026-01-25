# Como Gerar uma Nova Chave da Abstract API

## Sua chave atual está inválida

A chave `209f8cf71fef4f00851b04aaced772c2` não está funcionando. Você precisa gerar uma nova.

## Passo a Passo:

### 1. Acesse o Dashboard da Abstract API
- Vá para: https://app.abstractapi.com/
- Faça login com sua conta

### 2. Vá para Email Validation API
- No dashboard, procure por **"Email Validation API"**
- Ou acesse diretamente: https://app.abstractapi.com/api/email-validation

### 3. Ver sua Chave Atual
- Você verá sua **API Key** atual
- Se ela for diferente de `209f8cf71fef4f00851b04aaced772c2`, use a chave que está lá

### 4. Se a Chave Estiver Incorreta ou Quiser Gerar Nova

**Opção A - Verificar chave existente:**
- Se já houver uma chave mostrada, copie essa
- Use essa chave (não a antiga)

**Opção B - Se não houver chave ou quiser nova:**
- Procure por **"Generate new key"** ou **"Reset key"**
- Ou entre em **"Account Settings"** → **"API Keys"**
- Gere uma nova chave

### 5. Copiar a Nova Chave
- Copie a chave completa (deve ter 32 caracteres)
- Não copie espaços extras

### 6. Atualizar no Netlify
1. Acesse seu projeto no Netlify
2. Vá em **Site settings** → **Environment variables**
3. Encontre `EMAIL_VALIDATION_API_KEY`
4. Clique em **Edit**
5. Cole a **NOVA** chave
6. Clique em **Save**

### 7. Fazer Novo Deploy
- **IMPORTANTE:** Faça um novo deploy após atualizar
- Commit/push ou "Trigger deploy" no Netlify

### 8. Testar a Nova Chave
Teste no navegador substituindo `SUA_NOVA_CHAVE`:
```
https://emailvalidation.abstractapi.com/v1/?api_key=SUA_NOVA_CHAVE&email=test@gmail.com
```

Se retornar JSON com informações do email, está funcionando! ✅

## Possíveis Motivos da Chave Estar Inválida:

1. ❌ Chave foi revogada/expirada
2. ❌ Chave foi regenerada e você não atualizou
3. ❌ Chave foi copiada incorretamente
4. ❌ Conta foi suspensa ou plano expirado

## Se Não Conseguir Acessar:

1. Verifique se está logado na conta correta
2. Verifique se o plano gratuito ainda está ativo
3. Entre em contato com suporte: https://www.abstractapi.com/support

