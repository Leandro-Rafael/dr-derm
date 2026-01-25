# 🔍 Como Verificar os Logs - Passo a Passo

## 🚨 Email Não Chegou? Vamos Diagnosticar!

Siga estes passos na ordem para descobrir o problema:

---

## 📋 Passo 1: Verificar Logs do Netlify Functions

### Como fazer:
1. Acesse o Netlify: https://app.netlify.com
2. Clique no seu site (drderm)
3. No menu superior, clique em **"Site settings"** (⚙️ engrenagem)
4. No menu lateral esquerdo, clique em **"Functions"**
5. Clique em **"View logs"** ou **"View function logs"**

### O que procurar:
- Procure por logs relacionados a `auth-forgot-password`
- Procure por mensagens que começam com `===`
- Procure por erros (em vermelho)

### Mensagens importantes:
- ✅ `=== INÍCIO RECUPERAÇÃO DE SENHA ===`
- ✅ `Email recebido: seuemail@exemplo.com`
- ✅ `RESEND_API_KEY configurada: true` ou `false`
- ✅ `Usuário encontrado: seuemail@exemplo.com`
- ✅ `Email enviado com sucesso!`
- ❌ `Erro ao enviar email: ...`
- ❌ `RESEND_API_KEY configurada: false`

### Se encontrar erros:
- Copie a mensagem de erro completa
- Me envie a mensagem para eu ajudar

---

## 📋 Passo 2: Verificar Variáveis de Ambiente

### Como fazer:
1. No Netlify, vá em: **Site settings** > **Environment variables**
2. Verifique se existem estas 2 variáveis:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

### Se não existirem:
- Adicione as variáveis
- Faça um novo deploy

### Se existirem:
- Verifique se os valores estão corretos
- `RESEND_API_KEY` deve começar com `re_`
- `RESEND_FROM_EMAIL` deve ser `onboarding@resend.dev` (para testes)

---

## 📋 Passo 3: Verificar Logs do Resend

### Como fazer:
1. Acesse o Resend: https://resend.com
2. No menu lateral, clique em **"Emails"**
3. Verifique se há emails enviados
4. Clique em cada email para ver detalhes

### O que procurar:
- **Status**: "Delivered" (entregue), "Pending" (pendente), "Failed" (falhou)
- **To**: Email de destino
- **From**: Email remetente
- **Subject**: Assunto do email
- **Error**: Mensagem de erro (se houver)

### Se não houver emails:
- A função não está sendo chamada
- Ou há um erro antes de enviar o email
- Verifique os logs do Netlify

### Se houver emails com status "Failed":
- Veja a mensagem de erro
- Verifique se o email remetente está correto
- Verifique se a API Key tem permissões corretas

---

## 📋 Passo 4: Testar no Console do Navegador

### Como fazer:
1. Abra a página de login
2. Pressione **F12** para abrir o Developer Tools
3. Vá na aba **"Console"**
4. Cole este código e pressione Enter:

```javascript
fetch('/.netlify/functions/auth-forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'SEU_EMAIL_AQUI@exemplo.com' })
})
.then(r => r.json())
.then(data => {
  console.log('Resposta:', data);
})
.catch(error => {
  console.error('Erro:', error);
});
```

### Substitua:
- `SEU_EMAIL_AQUI@exemplo.com` pelo email que você quer testar

### O que procurar:
- **Resposta**: Veja o que retorna
- **Erros**: Veja se há erros no console

---

## 📋 Passo 5: Verificar Network Tab

### Como fazer:
1. Abra a página de login
2. Pressione **F12** para abrir o Developer Tools
3. Vá na aba **"Network"** (Rede)
4. Clique em "Esqueceu sua senha?"
5. Digite um email e clique em "Enviar Senha"
6. Procure por uma requisição para `auth-forgot-password`
7. Clique na requisição

### O que verificar:
- **Status**: Deve ser 200 (sucesso) ou 400/500 (erro)
- **Response**: Veja a resposta do servidor
- **Request**: Veja o que foi enviado

---

## 📋 Passo 6: Verificar se o Usuário Existe

### Como fazer:
1. Acesse o Supabase: https://supabase.com
2. Vá no seu projeto
3. Vá em **"Table Editor"** > **"users"**
4. Procure pelo email que você está testando
5. Verifique se o usuário existe

### Se o usuário não existir:
- A função retorna sucesso (por segurança)
- Mas não envia email
- Cadastre o usuário primeiro

---

## 🐛 Problemas Comuns

### Problema 1: "RESEND_API_KEY configurada: false"

#### Solução:
1. Verifique se a variável está configurada no Netlify
2. Verifique se o valor está correto
3. Faça um novo deploy após adicionar/atualizar

---

### Problema 2: "Usuário não encontrado"

#### Solução:
1. Verifique se o email está cadastrado no banco
2. Verifique se o email está escrito corretamente
3. Cadastre o usuário primeiro

---

### Problema 3: "Erro ao enviar email"

#### Solução:
1. Verifique se a API Key está correta
2. Verifique se o email remetente está correto
3. Verifique os logs do Resend para ver o erro específico

---

### Problema 4: "Email enviado mas não chega"

#### Solução:
1. Verifique a pasta de spam
2. Aguarde alguns minutos (pode demorar)
3. Teste com outro email (Gmail, Outlook, etc.)
4. Verifique se o provedor de email não está bloqueando

---

## ✅ Checklist Rápido

- [ ] Logs do Netlify verificados
- [ ] Variáveis de ambiente configuradas
- [ ] Logs do Resend verificados
- [ ] Teste no console do navegador realizado
- [ ] Network tab verificado
- [ ] Usuário existe no banco de dados
- [ ] Pasta de spam verificada
- [ ] Aguardou alguns minutos

---

## 🆘 Me Envie Estas Informações

Se ainda não funcionar, me envie:

1. **Logs do Netlify** (últimas linhas relacionadas a `auth-forgot-password`)
2. **Status no Resend** (se houver emails)
3. **Resposta do console do navegador** (quando testar)
4. **Mensagem de erro** (se houver)

Com essas informações, consigo ajudar melhor! 🚀

---

## 💡 Dica

**Comece sempre pelos logs do Netlify!** Eles mostram exatamente o que está acontecendo.

