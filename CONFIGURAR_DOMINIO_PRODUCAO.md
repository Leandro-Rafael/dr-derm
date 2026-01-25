# 🚀 Configurar Domínio Próprio para Produção (Resend)

## ⚠️ Importante

**`onboarding@resend.dev` é APENAS para testes!**

Para produção, você **DEVE** usar um domínio próprio para:
- ✅ Melhor entrega de emails (não ir para spam)
- ✅ Email profissional (ex: `noreply@drderm.com`)
- ✅ Confiabilidade
- ✅ Melhor reputação do domínio

---

## 📋 Passo a Passo: Configurar Domínio no Resend

### Passo 1: Adicionar Domínio no Resend

1. Acesse o painel do Resend: https://resend.com
2. No menu lateral, clique em **"Domains"** (Domínios)
3. Clique no botão **"Add Domain"** (Adicionar Domínio)
4. Digite seu domínio (ex: `drderm.com`)
   - ⚠️ **NÃO** coloque `www.` ou `http://`
   - ✅ Use apenas: `drderm.com`
5. Clique em **"Add"** (Adicionar)

### Passo 2: Configurar Registros DNS

O Resend vai mostrar uma página com os registros DNS que você precisa adicionar.

#### Você verá algo assim:

```
Tipo: TXT
Nome: @
Valor: v=spf1 include:resend.com ~all

Tipo: CNAME
Nome: resend._domainkey
Valor: resend._domainkey.resend.com

Tipo: TXT
Nome: _dmarc
Valor: v=DMARC1; p=none;
```

### Passo 3: Adicionar Registros no Seu Provedor DNS

1. Acesse o painel do seu provedor de DNS:
   - **Cloudflare**: https://dash.cloudflare.com
   - **GoDaddy**: https://godaddy.com
   - **Namecheap**: https://namecheap.com
   - **Registro.br**: https://registro.br
   - Ou outro provedor que você use

2. Encontre a seção de **"DNS"** ou **"Zona DNS"**

3. Adicione os registros que o Resend mostrou:
   - **Tipo TXT** para SPF
   - **Tipo CNAME** para DKIM
   - **Tipo TXT** para DMARC (opcional, mas recomendado)

4. **Salve** os registros

### Passo 4: Aguardar Verificação

1. Volte para o Resend
2. O status do domínio será **"Pending"** (Pendente)
3. Aguarde alguns minutos (pode levar até 24 horas)
4. O status mudará para **"Verified"** (Verificado) quando estiver pronto

### Passo 5: Verificar Status

1. No Resend, vá em **"Domains"**
2. Verifique se o status está **"Verified"** ✅
3. Se estiver, você pode usar emails do seu domínio!

---

## 📧 Atualizar Variável no Netlify

### Depois que o domínio estiver verificado:

1. Acesse o Netlify: https://app.netlify.com
2. Vá em: **Site settings** > **Environment variables**
3. Encontre a variável `RESEND_FROM_EMAIL`
4. Clique em **"Edit"** (Editar)
5. Altere o valor para:
   ```
   noreply@drderm.com
   ```
   - Ou: `contato@drderm.com`
   - Ou: `suporte@drderm.com`
   - Use o domínio que você verificou!
6. Clique em **"Save"** (Salvar)
7. **Faça um novo deploy**

---

## 🎯 Exemplos de Emails para Produção

### Opções recomendadas:

- `noreply@drderm.com` - Para emails automáticos (recomendado)
- `contato@drderm.com` - Para contato
- `suporte@drderm.com` - Para suporte
- `noreply@seudominio.com` - Genérico

### ⚠️ Evite:

- `onboarding@resend.dev` - Apenas para testes
- `teste@drderm.com` - Não profissional
- `admin@drderm.com` - Pode receber spam

---

## 🔍 Verificar se Está Funcionando

### Teste 1: Enviar Email de Teste
1. Acesse sua página de login
2. Clique em "Esqueceu sua senha?"
3. Digite um email cadastrado
4. Verifique se o email foi recebido
5. **Verifique o remetente**: Deve aparecer `noreply@drderm.com` (ou o email que você configurou)

### Teste 2: Verificar no Resend
1. No Resend, vá em **"Emails"**
2. Verifique os emails enviados
3. O remetente deve ser seu domínio próprio

### Teste 3: Verificar Reputação
1. Use ferramentas como: https://mxtoolbox.com
2. Verifique se o domínio está bem configurado
3. Verifique se não está em listas de spam

---

## 🆘 Problemas Comuns

### "Domínio não está sendo verificado"
**Solução:**
- Verifique se os registros DNS foram adicionados corretamente
- Aguarde até 24 horas (DNS pode demorar para propagar)
- Verifique se não há erros de digitação nos registros
- Use ferramentas como `dig` ou `nslookup` para verificar os registros

### "Emails ainda vão para spam"
**Solução:**
- Configure os registros SPF, DKIM e DMARC corretamente
- Use um domínio próprio (não `onboarding@resend.dev`)
- Evite palavras que podem ser consideradas spam no assunto/conteúdo
- Configure o DMARC com política `p=quarantine` ou `p=reject` (após testar)

### "Não consigo adicionar registros DNS"
**Solução:**
- Verifique se você tem acesso ao painel DNS do seu provedor
- Entre em contato com o suporte do seu provedor de DNS
- Ou transfira o domínio para um provedor que permita edição de DNS

---

## 📊 Comparação: Teste vs Produção

| Aspecto | Teste (`onboarding@resend.dev`) | Produção (`noreply@drderm.com`) |
|---------|--------------------------------|--------------------------------|
| **Uso** | Apenas testes | Produção |
| **Entrega** | Pode ir para spam | Melhor entrega |
| **Profissionalismo** | ❌ Não profissional | ✅ Profissional |
| **Reputação** | Limitada | Melhor reputação |
| **Configuração** | Pronto para usar | Precisa configurar DNS |

---

## ✅ Checklist para Produção

- [ ] Domínio adicionado no Resend
- [ ] Registros DNS configurados (SPF, DKIM, DMARC)
- [ ] Domínio verificado no Resend (status: "Verified")
- [ ] Variável `RESEND_FROM_EMAIL` atualizada no Netlify
- [ ] Deploy feito após atualizar variável
- [ ] Teste de envio realizado com sucesso
- [ ] Email recebido com remetente correto
- [ ] Email não está indo para spam

---

## 🎯 Resumo

### Para Testes:
- ✅ Use: `onboarding@resend.dev`
- ✅ Não precisa configurar nada
- ✅ Funciona imediatamente

### Para Produção:
- ✅ Use: `noreply@seudominio.com` (ou similar)
- ✅ Configure domínio no Resend
- ✅ Adicione registros DNS
- ✅ Aguarde verificação
- ✅ Atualize variável no Netlify

---

## 💡 Dica

**Comece com testes usando `onboarding@resend.dev`**, e depois configure o domínio próprio para produção. Assim você pode testar tudo antes de colocar em produção!

---

**Precisa de ajuda para configurar o domínio?** Me diga qual provedor de DNS você usa! 🚀

