# Como Ver a Senha do Admin no Banco de Dados

## Método 1: Usando o Table Editor (Mais Fácil)

1. Acesse o Supabase: https://app.supabase.com
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **Table Editor**
4. Clique na tabela **users**
5. Procure pelo usuário com email `drderm.adm@ofc`
6. Na coluna **password_hash**, você verá a senha armazenada
   - O formato é: `demo:SenhaAtual`
   - Exemplo: Se estiver `demo:Bruno`, a senha é `Bruno`
   - Se estiver `demo:MinhaSenha123`, a senha é `MinhaSenha123`

## Método 2: Usando o SQL Editor (Mais Preciso)

1. Acesse o Supabase: https://app.supabase.com
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New query**
5. Cole e execute este comando SQL:

```sql
SELECT 
    email,
    name,
    password_hash,
    is_admin,
    is_blocked,
    created_at
FROM users
WHERE email = 'drderm.adm@ofc';
```

6. O resultado mostrará:
   - **email**: `drderm.adm@ofc`
   - **password_hash**: A senha no formato `demo:SenhaAtual`
   - **is_admin**: `true` (deve estar marcado)
   - **is_blocked**: `false` (deve estar desmarcado)

## Como Interpretar a Senha

A senha está armazenada no formato: `demo:SenhaReal`

- **Exemplo 1**: Se `password_hash` = `demo:Bruno` → A senha é: **Bruno**
- **Exemplo 2**: Se `password_hash` = `demo:Admin123` → A senha é: **Admin123**
- **Exemplo 3**: Se `password_hash` = `demo:MinhaSenha` → A senha é: **MinhaSenha**

**Importante**: Tudo que vem depois de `demo:` é a senha real!

## Se o Admin Não Existir

Se você executar o SQL e não retornar nenhum resultado, o admin não existe. Execute este comando para criá-lo:

```sql
INSERT INTO users (email, name, password_hash, is_admin, is_blocked)
VALUES ('drderm.adm@ofc', 'Administrador', 'demo:Bruno', TRUE, FALSE)
ON CONFLICT (email) DO UPDATE 
SET password_hash = 'demo:Bruno',
    is_admin = TRUE,
    is_blocked = FALSE;
```

Isso criará o admin com:
- **Email**: `drderm.adm@ofc`
- **Senha**: `Bruno`

## Alterar a Senha do Admin

Se quiser alterar a senha, execute:

```sql
UPDATE users
SET password_hash = 'demo:NovaSenhaAqui'
WHERE email = 'drderm.adm@ofc';
```

Substitua `NovaSenhaAqui` pela senha que você deseja usar.

**Exemplo**: Para definir a senha como `Admin2024`:
```sql
UPDATE users
SET password_hash = 'demo:Admin2024'
WHERE email = 'drderm.adm@ofc';
```

Depois disso, use:
- **Email**: `drderm.adm@ofc`
- **Senha**: `Admin2024`



