# Como Configurar Supabase no Netlify - Passo a Passo

## 📍 PARTE 1: Encontrar os Dados no Supabase

### Passo 1: Acessar o Supabase
1. Abra seu navegador
2. Acesse: **https://app.supabase.com**
3. Faça login na sua conta

### Passo 2: Selecionar o Projeto
1. Na tela inicial, você verá uma lista de projetos
2. Clique no projeto **DrDerm** (ou o nome que você deu ao projeto)

### Passo 3: Ir para Configurações
1. No menu lateral esquerdo, procure por **"Settings"** ou **"Configurações"**
   - É o ícone de uma **engrenagem** ⚙️
   - Geralmente fica na parte inferior do menu
2. Clique em **"Settings"**

### Passo 4: Acessar a Seção API
1. Dentro de Settings, você verá várias abas no topo:
   - General
   - API ← **CLIQUE AQUI**
   - Database
   - Auth
   - Storage
   - etc.
2. Clique na aba **"API"**

### Passo 5: Encontrar as Chaves
Agora você verá uma página com várias informações. Procure por:

#### 🔹 Project URL (SUPABASE_URL)
- Está no topo da página
- Começa com `https://`
- Termina com `.supabase.co`
- **Exemplo**: `https://abcdefghijklmnop.supabase.co`
- **Copie este valor completo** → Este é o `SUPABASE_URL`

#### 🔹 API Keys (Chaves de API)
Logo abaixo, você verá uma seção chamada **"API Keys"** com várias chaves:

1. **anon public** ← **ESTA É A QUE VOCÊ PRECISA!**
   - É uma string muito longa que começa com `eyJ...`
   - Ao lado tem um botão **"Reveal"** ou **"Mostrar"**
   - Clique em **"Reveal"** para ver a chave completa
   - Depois clique em **"Copy"** para copiar
   - **Esta é a `SUPABASE_ANON_KEY`**

2. **service_role** (NÃO USE ESTA NO FRONTEND)
   - Esta é secreta, não copie para o Netlify ainda
   - Só use se precisar de permissões administrativas no backend

---

## 📍 PARTE 2: Configurar no Netlify

### Passo 1: Acessar o Netlify
1. Abra uma nova aba no navegador
2. Acesse: **https://app.netlify.com**
3. Faça login na sua conta

### Passo 2: Selecionar o Site
1. Na tela inicial, você verá uma lista de sites
2. Clique no site **drdermofc** (ou o nome do seu site)

### Passo 3: Ir para Configurações do Site
1. No menu superior do site, clique em **"Site settings"** ou **"Configurações do site"**
   - Pode estar escrito como "Site configuration" também

### Passo 4: Acessar Variáveis de Ambiente
1. No menu lateral esquerdo, procure por:
   - **"Environment variables"** ou
   - **"Variáveis de ambiente"** ou
   - **"Build & deploy"** → **"Environment"**
2. Clique nessa opção

### Passo 5: Adicionar as Variáveis
Agora você verá uma lista de variáveis (pode estar vazia se for a primeira vez).

#### Adicionar SUPABASE_URL:
1. Clique no botão **"Add a variable"** ou **"Adicionar variável"**
2. No campo **"Key"** (Chave), digite: `SUPABASE_URL`
3. No campo **"Value"** (Valor), cole o **Project URL** que você copiou do Supabase
4. Em **"Scopes"**, selecione **"Production"** (e "Deploy previews" se quiser)
5. Clique em **"Save"** ou **"Salvar"**

#### Adicionar SUPABASE_ANON_KEY:
1. Clique novamente em **"Add a variable"**
2. No campo **"Key"**, digite: `SUPABASE_ANON_KEY`
3. No campo **"Value"**, cole a chave **anon public** que você copiou do Supabase
4. Em **"Scopes"**, selecione **"Production"** (e "Deploy previews" se quiser)
5. Clique em **"Save"**

#### Adicionar ENCRYPTION_KEY (Opcional mas Recomendado):
1. Clique novamente em **"Add a variable"**
2. No campo **"Key"**, digite: `ENCRYPTION_KEY`
3. Para gerar uma chave segura, você pode:
   - Usar um gerador online: https://www.random.org/strings/
   - Ou executar no terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Ou usar este valor de exemplo (NÃO USE EM PRODUÇÃO): `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`
4. Cole a chave no campo **"Value"**
5. Em **"Scopes"**, selecione **"Production"**
6. Clique em **"Save"**

---

## ✅ Verificação Final

Depois de adicionar todas as variáveis, você deve ter:

```
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ENCRYPTION_KEY = (sua chave de 64 caracteres)
```

---

## 🔄 Atualizar o Site

Após adicionar as variáveis:
1. Vá em **"Deploys"** no menu do Netlify
2. Clique nos três pontinhos (⋯) do último deploy
3. Selecione **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Isso fará um novo deploy com as variáveis de ambiente

---

## 🆘 Problemas Comuns

### "Não encontro a aba API"
- Certifique-se de estar dentro do projeto (não na lista de projetos)
- O menu Settings fica no canto inferior esquerdo
- Se não encontrar, tente clicar diretamente em: `https://app.supabase.com/project/[seu-projeto-id]/settings/api`

### "A chave anon public está oculta"
- Clique no botão **"Reveal"** ou **"Show"** ao lado da chave
- Depois clique em **"Copy"** para copiar

### "As variáveis não estão funcionando"
- Certifique-se de que fez um novo deploy após adicionar as variáveis
- Verifique se os nomes das variáveis estão exatamente como mostrado (case-sensitive)
- No Netlify, as variáveis só ficam disponíveis após um novo deploy

---

## 📞 Precisa de Ajuda?

Se ainda tiver dúvidas, me diga em qual passo você está travado que eu te ajudo!
