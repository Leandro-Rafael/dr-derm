# 🧪 Teste Rápido: Verificar se Está Funcionando

## 🎯 Teste Simples no Console do Navegador

### Passo 1: Abrir o Console
1. Abra a página de login
2. Pressione **F12** (Developer Tools)
3. Vá na aba **"Console"**

### Passo 2: Cole Este Código

```javascript
// Teste de recuperação de senha
fetch('/.netlify/functions/auth-forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'SEU_EMAIL_AQUI@exemplo.com' })
})
.then(async res => {
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Resposta:', data);
  return data;
})
.catch(error => {
  console.error('Erro:', error);
});
```

### Passo 3: Substitua o Email
- Substitua `SEU_EMAIL_AQUI@exemplo.com` pelo email que você quer testar
- **IMPORTANTE**: Use um email que esteja cadastrado no banco de dados

### Passo 4: Execute
- Pressione **Enter**
- Veja o que aparece no console

### O que deve aparecer:
- ✅ `Status: 200` = Sucesso
- ✅ `Resposta: { message: "Email enviado com sucesso!..." }`
- ❌ `Status: 400` = Erro (veja a mensagem)
- ❌ `Status: 500` = Erro no servidor

---

## 🔍 Verificar Variáveis de Ambiente

### No Netlify:
1. Vá em: **Site settings** > **Environment variables**
2. Verifique se existem:
   - `RESEND_API_KEY` = `re_...`
   - `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

### Se não existirem:
- Adicione as variáveis
- **Faça um novo deploy** (importante!)

---

## 📊 Verificar Logs do Netlify

### Método 1: Clicar na Função
1. Vá em: **Logs** > **Functions**
2. Clique na função `auth-forgot-password`
3. Veja os logs

### Método 2: Buscar nos Logs
1. Vá em: **Logs** > **Functions**
2. Use `Ctrl+F` e digite: `auth-forgot-password`
3. Veja as mensagens de log

### O que procurar:
- `=== INÍCIO RECUPERAÇÃO DE SENHA ===`
- `RESEND_API_KEY configurada: true` ou `false`
- `Usuário encontrado: ...`
- `Email enviado com sucesso!`
- Erros (em vermelho)

---

## 🐛 Problemas Comuns

### Problema 1: "RESEND_API_KEY configurada: false"
**Solução:**
- Adicione a variável `RESEND_API_KEY` no Netlify
- Faça um novo deploy

### Problema 2: "Usuário não encontrado"
**Solução:**
- Verifique se o email está cadastrado no banco
- Use um email que você sabe que está cadastrado

### Problema 3: "Erro ao enviar email"
**Solução:**
- Verifique se a API Key está correta
- Verifique os logs do Resend
- Verifique se o email remetente está correto

---

## ✅ Checklist

- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Deploy feito após configurar variáveis
- [ ] Teste no console do navegador realizado
- [ ] Logs do Netlify verificados
- [ ] Email cadastrado no banco de dados
- [ ] Pasta de spam verificada

---

## 🆘 Me Envie:

1. **O que aparece no console** quando você testa
2. **Os logs do Netlify** (se conseguir ver)
3. **Se as variáveis estão configuradas** no Netlify

Com essas informações, consigo ajudar melhor! 🚀

