# Como Corrigir Erro 401 na API de Verificação de Email

## Erro: "Email inválido: Erro na API de verificação (401)"

O erro 401 significa que a chave da API está incorreta ou não está sendo enviada corretamente.

## Passos para Resolver:

### 1. Verificar se a Chave Está Correta

Sua chave deve ser: `209f8cf71fef4f00851b04aaced772c2`

**Verifique:**
- Sem espaços antes ou depois
- Sem quebras de linha
- Exatamente 32 caracteres

### 2. Verificar no Netlify

1. **Acesse seu projeto no Netlify:**
   - https://app.netlify.com
   - Clique no **nome do seu projeto** (não em Team settings)

2. **Vá em Site settings:**
   - Menu do projeto → **Site settings**
   - No menu lateral → **Environment variables**

3. **Verifique a variável:**
   - Deve existir uma variável chamada: `ABSTRACT_API_KEY`
   - O valor deve ser: `209f8cf71fef4f00851b04aaced772c2`
   - Verifique se está marcada para **Production**

4. **Se não existir ou estiver errada:**
   - Clique em **"Edit"** ou **"Add variable"**
   - **Key:** `ABSTRACT_API_KEY` (exatamente assim, maiúsculas)
   - **Value:** `209f8cf71fef4f00851b04aaced772c2`
   - Marque **Production**
   - Clique em **Save**

### 3. Fazer Novo Deploy

**IMPORTANTE:** Após adicionar/editar a variável, você DEVE fazer um novo deploy:

**Opção A - Via Git:**
- Faça qualquer commit (mesmo uma mudança pequena)
- Faça push para seu repositório
- O Netlify vai fazer deploy automaticamente

**Opção B - Manual:**
- No Netlify, vá em **Deploys**
- Clique em **"Trigger deploy"** → **"Deploy site"**

### 4. Verificar a Chave na Abstract API

1. Acesse: https://app.abstractapi.com/
2. Faça login
3. Vá em **Email Validation API**
4. Veja sua **API Key**
5. Confirme que é: `209f8cf71fef4f00851b04aaced772c2`

Se a chave no dashboard da Abstract API for diferente, use a chave que está no dashboard.

### 5. Testar a API Diretamente

Você pode testar se a chave funciona usando:

```
https://emailvalidation.abstractapi.com/v1/?api_key=209f8cf71fef4f00851b04aaced772c2&email=test@gmail.com
```

Se retornar JSON, a chave está funcionando.
Se retornar erro 401, a chave está incorreta ou expirada.

### 6. Verificar Logs

Após fazer deploy, tente cadastrar novamente e veja os logs:
- Netlify → Seu Projeto → Functions → auth-register → Logs
- Procure por: "API Key preview (first 8 chars):"
- Deve mostrar os primeiros 8 caracteres da chave

## Problemas Comuns:

❌ **Variável no Team settings ao invés do Projeto**
   - ✅ Solução: Adicione no nível do **PROJETO**

❌ **Nome da variável errado**
   - Deve ser exatamente: `ABSTRACT_API_KEY`
   - Não: `abstract_api_key`, `ABSTRACTAPI_KEY`, etc.

❌ **Não fez novo deploy**
   - ✅ Solução: Sempre faça novo deploy após mudar variáveis

❌ **Chave com espaços extras**
   - ✅ Solução: Copie e cole exatamente, sem espaços

❌ **Chave expirada ou inválida**
   - ✅ Solução: Gere uma nova chave na Abstract API

## Se Ainda Não Funcionar:

1. Gere uma nova chave na Abstract API
2. Adicione no Netlify com o nome `ABSTRACT_API_KEY`
3. Faça um novo deploy
4. Teste novamente

