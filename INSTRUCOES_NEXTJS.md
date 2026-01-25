# Instruções - Projeto AKADEMOS Next.js

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse a aplicação em: http://localhost:3000

## Estrutura do Projeto

```
/app
  /plataforma          # Página da plataforma
  layout.tsx           # Layout raiz com fontes
  page.tsx             # Página inicial
  globals.css          # Estilos globais

/components
  /ui
    Button.tsx         # Botão primário AKADEMOS
    FeatureCard.tsx   # Card de funcionalidade
    MockupCard.tsx    # Card de mockup
```

## Fontes

- **Poppins**: Configurada via Google Fonts
- **Hagrid**: Atualmente usando Playfair Display como alternativa (Hagrid não está disponível no Google Fonts)

### Para usar a fonte Hagrid localmente:

1. Adicione os arquivos da fonte Hagrid em `/public/fonts/`
2. Atualize `app/layout.tsx` para usar `localFont` do Next.js:

```typescript
import localFont from 'next/font/local'

const hagrid = localFont({
  src: '../public/fonts/Hagrid-Regular.woff2',
  variable: '--font-hagrid',
  display: 'swap',
})
```

## Paleta de Cores

- Roxo escuro: `#4b1d4f` (akademos-dark)
- Roxo médio: `#783b7d` (akademos-medium)
- Creme: `#efebe5` (akademos-cream)
- Branco: `#ffffff` (akademos-white)
- Cinza escuro: `#201f25` (akademos-gray)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
