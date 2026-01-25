# 🧪 Como Testar SEM Usar o Console

## 🎯 Método Mais Fácil: Testar pela Interface

Você **não precisa** usar o console! Pode testar diretamente pela interface:

### Passo 1: Abrir a Página de Login
1. Acesse sua página de login
2. Clique em **"Esqueceu sua senha?"**

### Passo 2: Digitar o Email
1. Digite um email que você sabe que está cadastrado no banco de dados
2. Clique em **"Enviar Senha"**

### Passo 3: Ver o Resultado
- Se aparecer uma mensagem de **sucesso** (verde), a função foi chamada
- Se aparecer uma mensagem de **erro** (vermelho), veja a mensagem

### Passo 4: Abrir o Console (Opcional)
1. Pressione **F12** (Developer Tools)
2. Vá na aba **"Console"**
3. Você verá mensagens de log automaticamente (sem precisar colar código)

---

## 🔍 Verificar se Está Funcionando

### O Que Deve Acontecer:

#### ✅ Se Funcionar:
- Aparece mensagem verde: "Email enviado com sucesso! Verifique sua caixa de entrada..."
- No console, você verá: "Enviando requisição...", "Resposta recebida. Status: 200"
- O email deve chegar em alguns minutos

#### ❌ Se Não Funcionar:
- Aparece mensagem vermelha com erro
- No console, você verá mensagens de erro
- Veja a mensagem de erro para identificar o problema

---

## 📊 Verificar Variáveis de Ambiente

### No Netlify:
1. Acesse: https://app.netlify.com
2. Vá em: **Site settings** > **Environment variables**
3. Verifique se existem:
   - `RESEND_API_KEY` = `re_...`
   - `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

### Se Não Existirem:
- Adicione as variáveis
- **Faça um novo deploy** (muito importante!)

---

## 🔍 Ver Logs do Netlify (Método Visual)

### Passo 1: Acessar Functions
1. No Netlify, vá em: **Logs** > **Functions**
2. Você verá uma lista de funções

### Passo 2: Clicar na Função
1. **Clique** no nome `auth-forgot-password`
2. Isso vai abrir os logs dessa função

### Passo 3: Ver os Logs
1. Você verá mensagens que começam com `===`
2. Procure por:
   - `RESEND_API_KEY configurada: true` ou `false`
   - `Usuário encontrado: ...`
   - `Email enviado com sucesso!`
   - Erros (em vermelho)

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: "Email não chegou"
**Verifique:**
- ✅ Variáveis de ambiente configuradas no Netlify?
- ✅ Deploy feito após configurar variáveis?
- ✅ Email está cadastrado no banco de dados?
- ✅ Pasta de spam verificada?
- ✅ Aguardou alguns minutos?

### Problema 2: "Mensagem de erro aparece"
**Verifique:**
- ✅ Qual é a mensagem de erro exata?
- ✅ Os logs do Netlify mostram algum erro?
- ✅ As variáveis de ambiente estão corretas?

### Problema 3: "Não consigo ver os logs"
**Solução:**
- Clique diretamente na função `auth-forgot-password` na lista
- Ou use `Ctrl+F` e digite `auth-forgot-password` para buscar

---

## ✅ Checklist Rápido

- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Deploy feito após configurar variáveis
- [ ] Teste realizado pela interface (sem console)
- [ ] Mensagem de sucesso/erro apareceu
- [ ] Logs do Netlify verificados
- [ ] Email cadastrado no banco de dados
- [ ] Pasta de spam verificada

---

## 💡 Dica

**Você não precisa usar o console!** 

Basta:
1. Testar pela interface
2. Ver a mensagem que aparece
3. Verificar os logs do Netlify se houver erro

---

## 🆘 Me Diga:

1. **O que aparece quando você testa** pela interface?
2. **Qual mensagem de erro** (se houver)?
3. **As variáveis estão configuradas** no Netlify?

Com essas informações, consigo ajudar melhor! 🚀

