# 📧 Código Completo: Como Enviar Email com Resend

## 🎯 Você não precisa procurar na documentação!

O código **já está pronto** no nosso projeto. Você só precisa configurar as variáveis no Netlify.

---

## 📝 O Código Completo (já está no projeto)

O código que envia o email está em: `netlify/functions/auth-forgot-password.js`

Aqui está a parte importante:

```javascript
// Enviar email usando Resend API
const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
        from: resendFromEmail,  // ← AQUI ESTÁ O "from:"
        to: email,
        subject: 'Recuperação de Senha - DrDerm',
        html: htmlContent,
        text: textContent
    })
});
```

---

## 🔍 Onde Está o `from:`?

### No nosso código:
- **Linha**: `from: resendFromEmail`
- **Valor**: Vem da variável de ambiente `RESEND_FROM_EMAIL`

### O que você precisa fazer:
1. **Não precisa procurar na documentação!**
2. **Adicione no Netlify**: `RESEND_FROM_EMAIL` = `onboarding@resend.dev`
3. **Pronto!** O código já está funcionando.

---

## 📚 Se Quiser Ver na Documentação do Resend

### Onde encontrar:
1. No menu lateral do Resend, procure por:
   - **"API Reference"** > **"Emails"** > **"Send Email"**
   - OU **"Docs"** > **"Send Email"**

### Ou acesse diretamente:
- URL: `https://resend.com/docs/api-reference/emails/send-email`

### Lá você verá:
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_123456789');

resend.emails.send({
  from: 'onboarding@resend.dev',  // ← AQUI ESTÁ!
  to: 'delivered@resend.dev',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});
```

---

## ✅ Mas Você NÃO Precisa Fazer Isso!

### Por quê?
- O código **já está pronto** no nosso projeto
- Você só precisa adicionar as **2 variáveis** no Netlify
- O código já usa o `from:` corretamente

---

## 🎯 O Que Você Precisa Fazer AGORA

### 1. No Netlify, adicione:

**Variável 1:**
- Key: `RESEND_API_KEY`
- Value: `re_abc123...` (sua API Key)

**Variável 2:**
- Key: `RESEND_FROM_EMAIL`
- Value: `onboarding@resend.dev`

### 2. Faça deploy

### 3. Teste

**Pronto!** Não precisa procurar mais nada! 😊

---

## 💡 Resumo

- ❌ **Não precisa** procurar na documentação do Resend
- ❌ **Não precisa** ver o código de exemplo
- ✅ **Só precisa** adicionar 2 variáveis no Netlify
- ✅ O código **já está funcionando**

---

## 🆘 Ainda com Dúvida?

### Pergunta: "Mas onde está o `from:` no código?"
**Resposta**: Está na linha 106 do arquivo `netlify/functions/auth-forgot-password.js`

### Pergunta: "Preciso mudar algo no código?"
**Resposta**: Não! O código já está pronto. Só configure as variáveis no Netlify.

### Pergunta: "Qual email usar no `from:`?"
**Resposta**: Use `onboarding@resend.dev` (para testes) ou `noreply@seudominio.com` (para produção)

---

**Consegue adicionar as variáveis no Netlify agora?** 🚀

