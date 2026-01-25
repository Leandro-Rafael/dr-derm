# Como Diagnosticar Erro 500 no Login

## 🔍 Passo 1: Verificar Variáveis de Ambiente no Netlify

O erro 500 geralmente acontece porque as variáveis do Supabase não estão configuradas.

### Verificar se estão configuradas:
1. Acesse: https://app.netlify.com
2. Clique no seu site
3. Vá em **Site settings** → **Environment variables**
4. Verifique se existem estas variáveis:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`
   - ⚠️ `ENCRYPTION_KEY` (opcional, mas recomendado)

### Se não existirem, adicione:
1. Clique em **"Add a variable"**
2. Adicione cada uma das variáveis acima
3. **IMPORTANTE**: Após adicionar, faça um novo deploy!

---

## 🔍 Passo 2: Verificar Logs do Netlify

Para ver o erro real que está acontecendo:

1. No Netlify, vá em **Site settings** → **Functions**
2. Ou acesse diretamente: https://app.netlify.com/sites/[seu-site]/functions
3. Clique em **"View logs"** ou **"Ver logs"**
4. Tente fazer login novamente
5. Veja os logs em tempo real para identificar o erro

### Ou via Dashboard:
1. No Netlify, vá em **Functions** no menu do site
2. Procure por `auth-login`
3. Clique para ver os logs

---

## 🔍 Passo 3: Verificar se o Supabase está Acessível

Teste se o Supabase está respondendo:

1. No Supabase Dashboard, vá em **Settings** → **API**
2. Copie o **Project URL**
3. Teste no navegador: `https://[seu-projeto].supabase.co/rest/v1/`
4. Deve retornar uma mensagem JSON (mesmo que seja erro, significa que está acessível)

---

## 🔍 Passo 4: Verificar se a Tabela Users Existe

Execute no SQL Editor do Supabase:

```sql
SELECT * FROM users LIMIT 1;
```

Se der erro, a tabela não existe. Execute o arquivo `SUPABASE_SETUP_COMPLETO.sql`.

---

## 🔍 Passo 5: Testar a Função Diretamente

Você pode testar a função diretamente via curl ou Postman:

```bash
curl -X POST https://[seu-site].netlify.app/api/auth-login \
  -H "Content-Type: application/json" \
  -d '{"email":"drderm.adm@ofc","password":"Bruno"}'
```

Isso mostrará o erro real no retorno.

---

## ✅ Solução Mais Comum

**90% dos casos**: As variáveis de ambiente não estão configuradas ou o deploy não foi feito após adicionar as variáveis.

### Solução:
1. Adicione as variáveis no Netlify
2. Vá em **Deploys**
3. Clique nos três pontinhos (⋯) do último deploy
4. Selecione **"Trigger deploy"** → **"Clear cache and deploy site"**
5. Aguarde o deploy terminar
6. Tente fazer login novamente

---

## 🆘 Se Ainda Não Funcionar

Envie-me:
1. O erro completo dos logs do Netlify (copie e cole)
2. Confirmação de que as variáveis estão configuradas
3. O resultado do teste da tabela users no Supabase
