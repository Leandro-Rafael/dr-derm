# 📧 Passo a Passo: Configurar Resend no Netlify

## Parte 1: Obter API Key no Resend

### Opção A: Se você já tem uma chave na tela de Integração
1. Na seção "Adicionar uma chave de API"
2. Clique no **ícone de olho** 👁️ para **revelar** a chave
3. Clique no **ícone de cópia** 📋 para copiar
4. **Cole a chave em um lugar seguro** (você vai precisar dela depois)

### Opção B: Criar uma nova chave de API
1. No menu lateral esquerdo, clique em **"Chaves de API"** (API Keys)
2. Clique no botão **"Create API Key"** ou **"Criar chave de API"**
3. Dê um nome: `Netlify DrDerm`
4. Permissões: Selecione **"Sending access"**
5. Clique em **"Create"** ou **"Criar"**
6. **COPIE A CHAVE AGORA** (ela só aparece uma vez!)
   - Formato: `re_abc123xyz456...`

---

## Parte 2: Configurar no Netlify

### Passo 1: Acessar o Netlify
1. Abra uma nova aba no navegador
2. Acesse: **https://app.netlify.com**
3. Faça login na sua conta

### Passo 2: Encontrar seu site
1. No painel do Netlify, você verá uma lista de sites
2. Clique no site do seu projeto (provavelmente "drderm" ou nome similar)

### Passo 3: Acessar Configurações
1. No menu superior, clique em **"Site settings"** (⚙️ ícone de engrenagem)
   - Ou clique nos **3 pontos** (...) ao lado do nome do site
   - E selecione **"Site settings"**

### Passo 4: Acessar Variáveis de Ambiente
1. No menu lateral esquerdo, procure por **"Environment variables"**
   - Ou role a página até encontrar a seção **"Build & deploy"**
   - E clique em **"Environment variables"**

### Passo 5: Adicionar Variável 1 - RESEND_API_KEY
1. Clique no botão **"Add a variable"** ou **"Adicionar variável"**
2. No campo **"Key"** (Chave), digite:
   ```
   RESEND_API_KEY
   ```
3. No campo **"Value"** (Valor), cole a API Key que você copiou do Resend:
   ```
   re_abc123xyz456... (cole sua chave aqui)
   ```
4. Clique em **"Save"** ou **"Salvar"**

### Passo 6: Adicionar Variável 2 - RESEND_FROM_EMAIL
1. Clique novamente em **"Add a variable"** ou **"Adicionar variável"**
2. No campo **"Key"** (Chave), digite:
   ```
   RESEND_FROM_EMAIL
   ```
3. No campo **"Value"** (Valor), digite:
   ```
   onboarding@resend.dev
   ```
   - Ou se você tem um domínio próprio: `noreply@seudominio.com`
4. Clique em **"Save"** ou **"Salvar"**

### Passo 7: Verificar se as variáveis foram salvas
Você deve ver duas variáveis na lista:
- ✅ `RESEND_API_KEY` = `re_...` (mascarado)
- ✅ `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

---

## Parte 3: Fazer Deploy

### Opção A: Deploy Automático (se estiver usando Git)
1. Faça um commit e push no seu repositório
2. O Netlify fará o deploy automaticamente

### Opção B: Deploy Manual
1. No painel do Netlify, vá em **"Deploys"** (menu superior)
2. Clique nos **3 pontos** (...) do último deploy
3. Selecione **"Trigger deploy"** > **"Clear cache and deploy site"**
4. Aguarde o deploy terminar

---

## Parte 4: Testar

1. Acesse sua página de login: `https://seusite.netlify.app/login.html`
2. Clique em **"Esqueceu sua senha?"**
3. Digite um email cadastrado
4. Clique em **"Enviar Senha"**
5. Verifique seu email (verifique também a pasta de spam)

---

## ❓ Problemas Comuns

### "Não consigo encontrar 'Environment variables' no Netlify"
- Certifique-se de estar em **"Site settings"** (não em "Account settings")
- Procure no menu lateral esquerdo
- Ou use a busca: pressione `Ctrl+F` e digite "environment"

### "A API Key não está funcionando"
- Verifique se copiou a chave completa (começa com `re_`)
- Verifique se não há espaços antes ou depois da chave
- Verifique se a chave tem permissão "Sending access"

### "Email não está sendo enviado"
- Verifique os logs: **Site settings** > **Functions** > **View logs**
- Procure por erros relacionados ao Resend
- Verifique se o deploy foi feito após adicionar as variáveis

### "Não consigo ver a API Key no Resend"
- Se você já criou uma chave antes, ela não aparece novamente por segurança
- Crie uma nova chave de API
- Ou verifique em **"Chaves de API"** > **"View"** (se disponível)

---

## 📸 Onde está cada coisa?

### No Resend:
- **API Key**: Menu lateral > "Chaves de API" > "Create API Key"
- **Email remetente**: Use `onboarding@resend.dev` para testes

### No Netlify:
- **Variáveis de ambiente**: Site settings > Environment variables
- **Logs**: Site settings > Functions > View logs

---

## ✅ Checklist

- [ ] API Key copiada do Resend
- [ ] Variável `RESEND_API_KEY` adicionada no Netlify
- [ ] Variável `RESEND_FROM_EMAIL` adicionada no Netlify
- [ ] Deploy feito após adicionar variáveis
- [ ] Teste realizado com sucesso

---

**Precisa de ajuda?** Me diga em qual passo você está travado! 😊

