# Configuração do Supabase para DrDerm

## Passo 1: Criar conta e projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (ou crie uma conta)
4. Clique em "New Project"
5. Preencha:
   - **Name**: drderm (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: escolha a mais próxima (ex: South America - São Paulo)
6. Aguarde alguns minutos para o projeto ser criado

## Passo 2: Executar o SQL Schema

1. No dashboard do Supabase, clique em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. **Cole todo o conteúdo** no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Deve aparecer "Success. No rows returned"

## Passo 3: Pegar as credenciais

1. No dashboard do Supabase, clique em **Settings** (⚙️)
2. Vá em **API**
3. Você verá:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon/public key** (uma chave longa começando com `eyJ...`)

## Passo 4: Configurar no Netlify

1. Acesse: https://app.netlify.com
2. Entre no seu projeto **drdermofc**
3. Vá em **Site configuration** → **Environment variables**
4. Adicione estas variáveis:

   **Nome**: `SUPABASE_URL`
   **Valor**: Cole o **Project URL** do Supabase

   **Nome**: `SUPABASE_ANON_KEY`
   **Valor**: Cole o **anon/public key** do Supabase

5. Salve as variáveis

## Passo 5: Fazer deploy novamente

```powershell
cd "C:\Users\Kelly\Desktop\drderm"
npm install
netlify deploy --prod --dir . --functions netlify/functions
```

## Pronto! 🎉

Seu site agora está conectado ao Supabase!

### Para verificar:
- Faça login normalmente
- Cadastre um novo usuário
- Verifique no Supabase → Table Editor → users (deve aparecer os usuários)

### Dicas:
- O usuário admin `drderm.adm@ofc` com senha `Bruno` já está criado no banco
- Você pode visualizar/editare dados no Supabase → Table Editor
- Tudo está salvo no PostgreSQL agora!

## Troubleshooting

**Erro "Supabase URL e Key não configuradas"**:
- Verifique se adicionou as variáveis de ambiente no Netlify
- Faça um novo deploy após adicionar

**Erro ao criar usuário**:
- Verifique se executou o SQL schema corretamente
- Confira se as tabelas existem no Supabase → Table Editor

