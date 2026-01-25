# 📧 Onde Está o Email Remetente (Parte 2)

## 🎯 Você não precisa procurar muito!

O email remetente é simplesmente: **`onboarding@resend.dev`**

Você pode usar este email diretamente, não precisa procurar em lugar nenhum!

---

## 📍 Onde Está na Tela do Resend

### Na seção "Enviar um e-mail":

No código de exemplo que aparece na tela, procure por esta linha:

```javascript
from: 'onboarding@resend.dev',
```

Ou se estiver em outra linguagem, procure por algo como:

```python
from="onboarding@resend.dev"
```

```bash
--from "onboarding@resend.dev"
```

### Se não encontrar no código:

**Não tem problema!** Você pode usar diretamente:

```
onboarding@resend.dev
```

Este é o email padrão do Resend para testes.

---

## ✅ O Que Você Precisa Fazer

### No Netlify, adicione a variável:

1. **Key**: `RESEND_FROM_EMAIL`
2. **Value**: `onboarding@resend.dev`

**Pronto!** Não precisa procurar mais nada.

---

## 🔍 Se Você Quiser Ver no Resend

### Opção 1: Na página de integração
- Role a página para baixo
- Procure pela seção "Enviar um e-mail"
- No código de exemplo, procure a linha com `from:`

### Opção 2: Nos Domínios
1. No menu lateral esquerdo, clique em **"Domínios"**
2. Se você tiver um domínio configurado, aparecerá lá
3. Se não tiver, use `onboarding@resend.dev`

### Opção 3: Diretamente no código
- O email remetente está no código de exemplo
- Geralmente na linha que diz `from: 'onboarding@resend.dev'`

---

## 💡 Resumo

**Você não precisa procurar!** Use diretamente:

```
onboarding@resend.dev
```

Este é o email que o Resend fornece para testes gratuitos.

---

## 🎯 Configuração Final no Netlify

Adicione estas 2 variáveis:

1. **RESEND_API_KEY** = `re_abc123...` (sua API Key)
2. **RESEND_FROM_EMAIL** = `onboarding@resend.dev` (email remetente)

**Pronto!** Não precisa mais procurar nada! 😊

