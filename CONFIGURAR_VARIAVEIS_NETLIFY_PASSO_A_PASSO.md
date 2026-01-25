# 🔧 Configurar Variáveis no Netlify - Passo a Passo Detalhado

## 🎯 Problema Identificado

Os logs mostram:
- ❌ `RESEND_API_KEY configurada: false`
- ❌ `RESEND_FROM_EMAIL: não configurado`

**Por isso o email não está sendo enviado!** Vamos configurar agora.

---

## 📋 Passo a Passo Completo

### Passo 1: Obter API Key do Resend

#### 1.1. Acesse o Resend
1. Abra: https://resend.com
2. Faça login na sua conta

#### 1.2. Criar API Key
1. No menu lateral, clique em **"API Keys"** (Chaves de API)
2. Clique no botão **"Create API Key"** (Criar Chave de API)
3. Dê um nome: `Netlify DrDerm`
4. Permissões: Selecione **"Sending access"**
5. Clique em **"Create"** (Criar)
6. **IMPORTANTE**: Copie a API Key agora (ela só aparece uma vez!)
   - Formato: `re_abc123xyz456...`
   - Cole em um bloco de notas para não perder

---

### Passo 2: Acessar Environment Variables no Netlify

#### 2.1. Acessar o Netlify
1. Abra: https://app.netlify.com
2. Faça login na sua conta

#### 2.2. Selecionar o Site
1. Clique no nome do seu site (provavelmente "drdermofc" ou "drderm")

#### 2.3. Acessar Site Settings
1. No menu superior, clique em **"Site settings"** (⚙️ ícone de engrenagem)
   - OU clique nos **3 pontos** (...) ao lado do nome do site
   - E selecione **"Site settings"**

#### 2.4. Acessar Environment Variables
1. No menu lateral esquerdo, procure por **"Environment variables"**
   - Se não encontrar, role a página para baixo
   - Ou use `Ctrl+F` e digite "environment"
2. Clique em **"Environment variables"**

---

### Passo 3: Adicionar Variável RESEND_API_KEY

#### 3.1. Adicionar Nova Variável
1. Clique no botão **"Add a variable"** ou **"Adicionar variável"**
   - Pode ser um botão verde ou azul
   - Ou um botão com texto "Add variable"

#### 3.2. Preencher os Campos
1. No campo **"Key"** (Chave), digite exatamente:
   ```
   RESEND_API_KEY
   ```
   - ⚠️ **Importante**: Deve ser EXATAMENTE assim (maiúsculas, sem espaços)

2. No campo **"Value"** (Valor), cole a API Key que você copiou do Resend:
   ```
   re_abc123xyz456... (cole sua chave aqui)
   ```
   - ⚠️ **Importante**: Cole a chave completa (começa com `re_`)

#### 3.3. Salvar
1. Clique no botão **"Save"** ou **"Salvar"**
2. A variável deve aparecer na lista

---

### Passo 4: Adicionar Variável RESEND_FROM_EMAIL

#### 4.1. Adicionar Nova Variável
1. Clique no botão **"Add a variable"** novamente

#### 4.2. Preencher os Campos
1. No campo **"Key"** (Chave), digite exatamente:
   ```
   RESEND_FROM_EMAIL
   ```
   - ⚠️ **Importante**: Deve ser EXATAMENTE assim (maiúsculas, sem espaços)

2. No campo **"Value"** (Valor), digite:
   ```
   onboarding@resend.dev
   ```
   - ⚠️ **Importante**: Para testes, use `onboarding@resend.dev`
   - Para produção, use um domínio próprio (ex: `noreply@drderm.com`)

#### 4.3. Salvar
1. Clique no botão **"Save"** ou **"Salvar"**
2. A variável deve aparecer na lista

---

### Passo 5: Verificar se as Variáveis Foram Salvas

#### 5.1. Verificar a Lista
Você deve ver duas variáveis na lista:
- ✅ `RESEND_API_KEY` = `re_...` (mascarado)
- ✅ `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

#### 5.2. Se Estiverem Corretas
- ✅ Próximo passo: Fazer deploy

#### 5.3. Se Não Estiverem Corretas
- ❌ Edite ou exclua e adicione novamente
- ❌ Verifique se não há espaços antes/depois dos valores

---

### Passo 6: Fazer Deploy (MUITO IMPORTANTE!)

#### 6.1. Por Que Fazer Deploy?
- As variáveis de ambiente só são aplicadas após um novo deploy
- O código atual não tem acesso às variáveis ainda

#### 6.2. Como Fazer Deploy

##### Opção A: Deploy Automático (se usar Git)
1. Faça um commit e push no seu repositório
2. O Netlify fará o deploy automaticamente

##### Opção B: Deploy Manual
1. No Netlify, vá em **"Deploys"** (menu superior)
2. Clique nos **3 pontos** (...) do último deploy
3. Selecione **"Trigger deploy"** > **"Clear cache and deploy site"**
4. Aguarde o deploy terminar (pode levar 1-2 minutos)

---

### Passo 7: Testar Novamente

#### 7.1. Testar a Funcionalidade
1. Acesse sua página de login
2. Clique em **"Esqueceu sua senha?"**
3. Digite o email: `leandro.101.rafael@gmail.com`
4. Clique em **"Enviar Senha"**

#### 7.2. Verificar os Logs
1. No Netlify, vá em: **Logs** > **Functions** > `auth-forgot-password`
2. Procure por:
   - ✅ `RESEND_API_KEY configurada: true` (deve ser `true` agora!)
   - ✅ `RESEND_FROM_EMAIL: onboarding@resend.dev`
   - ✅ `Email enviado com sucesso via Resend`

#### 7.3. Verificar o Email
1. Verifique a caixa de entrada de `leandro.101.rafael@gmail.com`
2. Verifique a pasta de spam
3. Aguarde alguns minutos (pode demorar)

---

## ✅ Checklist Final

- [ ] API Key copiada do Resend
- [ ] Variável `RESEND_API_KEY` adicionada no Netlify
- [ ] Variável `RESEND_FROM_EMAIL` adicionada no Netlify
- [ ] Deploy feito após adicionar variáveis
- [ ] Teste realizado
- [ ] Logs verificados (deve mostrar `RESEND_API_KEY configurada: true`)
- [ ] Email recebido

---

## 🐛 Problemas Comuns

### Problema 1: "Não encontro Environment variables"
**Solução:**
- Certifique-se de estar em **"Site settings"** (não "Account settings")
- Use `Ctrl+F` e digite "environment"
- Ou role a página para baixo

### Problema 2: "Variáveis não estão funcionando"
**Solução:**
- Verifique se fez o **deploy** após adicionar as variáveis
- Verifique se os nomes das variáveis estão corretos (maiúsculas)
- Verifique se não há espaços antes/depois dos valores

### Problema 3: "Ainda mostra `RESEND_API_KEY configurada: false`"
**Solução:**
- Verifique se fez o **deploy** após adicionar as variáveis
- Aguarde alguns minutos para o deploy terminar
- Verifique se os nomes das variáveis estão corretos

---

## 🎯 Resumo Rápido

1. ✅ Copiar API Key do Resend
2. ✅ Adicionar `RESEND_API_KEY` no Netlify
3. ✅ Adicionar `RESEND_FROM_EMAIL` no Netlify
4. ✅ **Fazer deploy** (importante!)
5. ✅ Testar novamente
6. ✅ Verificar logs (deve mostrar `true` agora)

---

## 🆘 Ainda Não Funciona?

### Me Envie:
1. **Screenshot** da página de Environment variables (com as variáveis)
2. **Logs do Netlify** após fazer o deploy
3. **Se o deploy foi feito** após adicionar as variáveis

---

**Pronto!** Siga estes passos e o email deve funcionar! 🚀

