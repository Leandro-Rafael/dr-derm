# 🔍 Diagnosticar: Email Não Chegou

## 🚨 Problema

O email de recuperação de senha não está chegando (nem na caixa de entrada nem no spam).

---

## 📋 Checklist de Diagnóstico

### 1. Verificar Variáveis de Ambiente no Netlify

#### Passo a passo:
1. Acesse o Netlify: https://app.netlify.com
2. Vá em: **Site settings** > **Environment variables**
3. Verifique se existem estas 2 variáveis:
   - ✅ `RESEND_API_KEY` = `re_...` (deve estar mascarado)
   - ✅ `RESEND_FROM_EMAIL` = `onboarding@resend.dev` (ou outro email)

#### Se não existirem:
- Adicione as variáveis
- Faça um novo deploy

#### Se existirem:
- Verifique se os valores estão corretos
- Verifique se não há espaços antes/depois dos valores

---

### 2. Verificar Logs do Netlify Functions

#### Passo a passo:
1. No Netlify, vá em: **Site settings** > **Functions**
2. Clique em **"View logs"** ou **"View function logs"**
3. Procure por logs relacionados a `auth-forgot-password`
4. Procure por erros ou mensagens

#### O que procurar:
- ✅ "Email enviado com sucesso via Resend"
- ❌ "Erro ao enviar email"
- ❌ "RESEND_API_KEY não configurada"
- ❌ Erros de autenticação

#### Se houver erros:
- Copie a mensagem de erro
- Verifique se a API Key está correta
- Verifique se o email remetente está correto

---

### 3. Verificar Logs do Resend

#### Passo a passo:
1. Acesse o Resend: https://resend.com
2. No menu lateral, clique em **"Emails"**
3. Verifique se há emails enviados
4. Verifique o status de cada email:
   - ✅ "Delivered" = Email entregue
   - ⏳ "Pending" = Aguardando envio
   - ❌ "Failed" = Falha no envio
   - ❌ "Bounced" = Email rejeitado

#### Se não houver emails:
- A função não está sendo chamada
- Ou há um erro antes de enviar o email

#### Se houver emails com status "Failed":
- Verifique a mensagem de erro
- Verifique se o email remetente está correto
- Verifique se a API Key tem permissões corretas

---

### 4. Verificar se a Função Está Sendo Chamada

#### No navegador (Developer Tools):
1. Abra a página de login
2. Abra o **Developer Tools** (F12)
3. Vá na aba **"Network"** (Rede)
4. Clique em "Esqueceu sua senha?"
5. Digite um email e clique em "Enviar Senha"
6. Procure por uma requisição para `auth-forgot-password`
7. Clique na requisição e verifique:
   - **Status**: Deve ser 200 (sucesso) ou 400/500 (erro)
   - **Response**: Veja a resposta do servidor

#### Se a requisição não aparecer:
- Há um erro no JavaScript do frontend
- Verifique o console do navegador (aba "Console")

#### Se a requisição aparecer com erro:
- Veja a mensagem de erro na resposta
- Verifique os logs do Netlify Functions

---

### 5. Verificar Console do Navegador

#### Passo a passo:
1. Abra a página de login
2. Abra o **Developer Tools** (F12)
3. Vá na aba **"Console"**
4. Clique em "Esqueceu sua senha?"
5. Digite um email e clique em "Enviar Senha"
6. Procure por erros ou mensagens

#### O que procurar:
- ❌ Erros de JavaScript
- ❌ Erros de rede (fetch failed)
- ❌ Mensagens de erro da API

---

### 6. Testar Manualmente a Função

#### Usando curl ou Postman:
```bash
curl -X POST https://seusite.netlify.app/.netlify/functions/auth-forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"seuemail@exemplo.com"}'
```

#### Ou usando o navegador:
1. Abra o Developer Tools (F12)
2. Vá na aba **"Console"**
3. Cole este código:
```javascript
fetch('/.netlify/functions/auth-forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'seuemail@exemplo.com' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```
4. Pressione Enter
5. Veja a resposta no console

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: "RESEND_API_KEY não configurada"

#### Sintoma:
- Logs mostram: "NOTA: Configure RESEND_API_KEY..."
- Email não é enviado (apenas logado no console)

#### Solução:
1. Verifique se a variável `RESEND_API_KEY` está configurada no Netlify
2. Verifique se o valor está correto (começa com `re_`)
3. Faça um novo deploy após adicionar/atualizar a variável

---

### Problema 2: "Erro de autenticação no Resend"

#### Sintoma:
- Logs mostram: "Erro ao enviar email via Resend"
- Status 401 ou 403 no Resend

#### Solução:
1. Verifique se a API Key está correta
2. Verifique se a API Key tem permissão "Sending access"
3. Gere uma nova API Key no Resend se necessário

---

### Problema 3: "Email remetente inválido"

#### Sintoma:
- Logs mostram: "Erro ao enviar email"
- Status 400 no Resend
- Mensagem sobre email remetente inválido

#### Solução:
1. Verifique se `RESEND_FROM_EMAIL` está configurado
2. Para testes, use: `onboarding@resend.dev`
3. Se usar domínio próprio, verifique se está verificado no Resend

---

### Problema 4: "Usuário não encontrado"

#### Sintoma:
- Função retorna sucesso, mas email não é enviado
- Mensagem: "Se o email estiver cadastrado..."

#### Solução:
1. Verifique se o email está cadastrado no banco de dados
2. Verifique se o email está escrito corretamente
3. Verifique os logs do Netlify para ver se o usuário foi encontrado

---

### Problema 5: "Email enviado mas não chega"

#### Sintoma:
- Logs mostram: "Email enviado com sucesso"
- Resend mostra status "Delivered"
- Mas email não chega

#### Solução:
1. Verifique a pasta de spam
2. Verifique se o email está correto
3. Aguarde alguns minutos (pode demorar)
4. Verifique se o provedor de email não está bloqueando
5. Teste com outro email (Gmail, Outlook, etc.)

---

## 🔧 Ações Imediatas

### 1. Verificar Variáveis de Ambiente
```bash
# No Netlify:
Site settings > Environment variables
- RESEND_API_KEY = re_...
- RESEND_FROM_EMAIL = onboarding@resend.dev
```

### 2. Verificar Logs do Netlify
```bash
# No Netlify:
Site settings > Functions > View logs
```

### 3. Verificar Logs do Resend
```bash
# No Resend:
Emails > Ver emails enviados
```

### 4. Testar no Console do Navegador
```javascript
// Cole no console do navegador:
fetch('/.netlify/functions/auth-forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'seuemail@exemplo.com' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## 📊 Checklist Completo

- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Deploy feito após configurar variáveis
- [ ] Logs do Netlify verificados
- [ ] Logs do Resend verificados
- [ ] Console do navegador verificado
- [ ] Requisição sendo feita (Network tab)
- [ ] Email cadastrado no banco de dados
- [ ] Email escrito corretamente
- [ ] Pasta de spam verificada
- [ ] Aguardou alguns minutos

---

## 🆘 Próximos Passos

1. **Verifique os logs do Netlify** primeiro
2. **Verifique os logs do Resend** depois
3. **Teste no console do navegador**
4. **Me envie os erros** que encontrar

---

**Me diga o que você encontrou nos logs!** Vou ajudar a resolver! 🚀

