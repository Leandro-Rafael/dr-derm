import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'

// Configuração das fontes
// Nota: Hagrid não está disponível no Google Fonts, usando Playfair Display como alternativa similar
// Para usar Hagrid, adicione o arquivo .woff2 na pasta /public/fonts e configure localmente
const hagrid = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-hagrid',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AKADEMOS - A sabedoria a um clique',
  description: 'Plataforma que conecta profissionais qualificados com clientes em busca de conhecimento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${hagrid.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}
