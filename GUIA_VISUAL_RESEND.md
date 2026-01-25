# 🎯 Guia Visual: Onde Está Cada Coisa no Resend

## 📍 Você está aqui: Página de Integração do Resend

Na tela que você está vendo, há **2 coisas importantes**:

---

## 1️⃣ PRIMEIRA PARTE: API Key (Chave de API)

### Onde está:
- **Seção**: "Adicionar uma chave de API"
- **O que você vê**: Um campo com texto mascarado tipo `re_xxxxxxxxx`

### O que fazer:
1. **Clique no ícone de OLHO** 👁️ (ao lado direito do campo)
   - Isso vai **revelar** a chave completa
2. **Clique no ícone de COPIAR** 📋 (ao lado do olho)
   - Isso vai copiar a chave para a área de transferência
3. **Cole a chave em um bloco de notas** (para não perder)
   - Formato: `re_abc123xyz456...`

### Se não tiver chave:
1. No menu lateral esquerdo, clique em **"Chaves de API"**
2. Clique em **"Create API Key"**
3. Dê um nome: `Netlify DrDerm`
4. Permissões: **"Sending access"**
5. Clique em **"Create"**
6. **COPIE A CHAVE** (ela só aparece uma vez!)

---

## 2️⃣ SEGUNDA PARTE: Email Remetente

### Onde está:
- **Seção**: "Enviar um e-mail"
- **No código de exemplo**, procure a linha:
  ```javascript
  from: 'onboarding@resend.dev',
  ```

### O que fazer:
- **Para testes**: Use `onboarding@resend.dev`
- **Para produção**: Configure um domínio próprio no Resend

---

## 3️⃣ CONFIGURAR NO NETLIFY

### Passo 1: Abrir Netlify
1. Abra uma **nova aba** no navegador
2. Acesse: **https://app.netlify.com**
3. Faça login

### Passo 2: Encontrar seu site
1. Clique no nome do seu site (ex: "drderm")

### Passo 3: Ir em Configurações
1. Clique em **"Site settings"** (⚙️ engrenagem no topo)
   - OU clique nos **3 pontos** (...) > **"Site settings"**

### Passo 4: Variáveis de Ambiente
1. No menu lateral esquerdo, clique em **"Environment variables"**
   - Se não encontrar, use a busca: `Ctrl+F` e digite "environment"

### Passo 5: Adicionar Variável 1
1. Clique em **"Add a variable"**
2. **Key**: `RESEND_API_KEY`
3. **Value**: Cole a API Key que você copiou (ex: `re_abc123...`)
4. Clique em **"Save"**

### Passo 6: Adicionar Variável 2
1. Clique em **"Add a variable"** novamente
2. **Key**: `RESEND_FROM_EMAIL`
3. **Value**: `onboarding@resend.dev`
4. Clique em **"Save"**

### Passo 7: Fazer Deploy
1. Vá em **"Deploys"** (menu superior)
2. Clique nos **3 pontos** (...) do último deploy
3. Selecione **"Trigger deploy"** > **"Clear cache and deploy site"**

---

## ✅ Resumo Rápido

### No Resend (tela atual):
1. 👁️ Revele a API Key (ícone de olho)
2. 📋 Copie a API Key (ícone de copiar)
3. ✉️ Anote o email: `onboarding@resend.dev`

### No Netlify:
1. Site settings > Environment variables
2. Adicione `RESEND_API_KEY` = (cole a chave)
3. Adicione `RESEND_FROM_EMAIL` = `onboarding@resend.dev`
4. Faça deploy

---

## 🆘 Ainda não encontrou?

### Problema: "Não vejo a API Key"
**Solução**: 
- Crie uma nova: Menu lateral > "Chaves de API" > "Create API Key"

### Problema: "Não encontro Environment variables no Netlify"
**Solução**:
- Certifique-se de estar em **"Site settings"** (não "Account settings")
- Procure no menu lateral esquerdo
- Ou vá em: Site settings > Build & deploy > Environment variables

### Problema: "A chave está mascarada e não consigo revelar"
**Solução**:
- Se você já criou a chave antes, ela não aparece novamente por segurança
- Crie uma nova chave de API
- Ou verifique em: Menu lateral > "Chaves de API" > Ver todas as chaves

---

## 📸 Onde Clicar (Resumo Visual)

### Na tela do Resend:
```
┌─────────────────────────────────────┐
│ Adicionar uma chave de API          │
│ [re_xxxxxxxxx] 👁️ 📋                │ ← Clique no 👁️ para revelar
│                                     │ ← Clique no 📋 para copiar
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Enviar um e-mail                    │
│ from: 'onboarding@resend.dev',      │ ← Este é o email remetente
└─────────────────────────────────────┘
```

### No Netlify:
```
Site settings → Environment variables → Add a variable
```

---

**Precisa de mais ajuda?** Me diga exatamente onde você está travado! 😊

