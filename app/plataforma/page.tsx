import React from 'react'
import { Button } from '@/components/ui/Button'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { MockupCard } from '@/components/ui/MockupCard'

/**
 * Página da Plataforma AKADEMOS
 * Apresenta as funcionalidades e características da plataforma
 */
export default function PlataformaPage() {
  // Lista de funcionalidades principais
  const features = [
    {
      title: 'Cadastro de Usuários',
      description: 'Sistema completo de cadastro para alunos e profissionais',
    },
    {
      title: 'Login com Autenticação',
      description: 'Autenticação segura e moderna com Clerk/Auth.js',
    },
    {
      title: 'Página de Busca',
      description: 'Busque professores e cursos de forma rápida e intuitiva',
    },
    {
      title: 'Sistema de Pagamento',
      description: 'Integração completa com gateway de pagamento',
    },
    {
      title: 'Chat Profissional/Cliente',
      description: 'Comunicação direta entre profissionais e alunos',
    },
    {
      title: 'Painel de Administração',
      description: 'Gerenciamento completo da plataforma',
    },
    {
      title: 'Cadastro de Cursos',
      description: 'Crie e gerencie seus cursos de forma simples',
    },
    {
      title: 'Sistema de Avaliação',
      description: 'Avalie e seja avaliado para garantir qualidade',
    },
    {
      title: 'Agendamento',
      description: 'Agende consultorias e aulas com facilidade',
    },
    {
      title: 'Videochamada',
      description: 'Aulas e consultorias ao vivo integradas',
    },
  ]

  // Mockups das telas
  const mockups = [
    {
      title: 'Tela de Busca',
      subtitle: 'Interface intuitiva para encontrar professores e cursos',
    },
    {
      title: 'Painel do Aluno',
      subtitle: 'Acompanhe seus cursos e agendamentos',
    },
    {
      title: 'Painel do Professor',
      subtitle: 'Gerencie seus cursos e alunos',
    },
    {
      title: 'Sistema de Chat',
      subtitle: 'Comunicação em tempo real',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Gradiente roxo com título e slogan */}
      <section className="relative bg-gradient-to-br from-akademos-dark via-akademos-medium to-akademos-dark py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-hagrid text-5xl md:text-7xl text-akademos-white mb-4">
            Plataforma AKADEMOS
          </h1>
          <p className="font-poppins text-xl md:text-2xl text-akademos-cream">
            A sabedoria a um clique
          </p>
        </div>
      </section>

      {/* Bloco de Texto Explicativo */}
      <section className="py-16 px-4 bg-akademos-cream">
        <div className="max-w-4xl mx-auto">
          <p className="font-poppins text-lg md:text-xl text-akademos-gray text-center leading-relaxed">
            A AKADEMOS é uma plataforma completa que conecta profissionais qualificados 
            com clientes em busca de conhecimento. Oferecemos agendamento, pagamentos, 
            videochamadas e chat em um só lugar, facilitando o aprendizado e a conexão 
            entre especialistas e alunos.
          </p>
        </div>
      </section>

      {/* Grade de Cartões de Funcionalidades */}
      <section className="py-16 px-4 bg-akademos-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-hagrid text-4xl md:text-5xl text-akademos-dark text-center mb-12">
            Principais Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Mockups */}
      <section className="py-16 px-4 bg-akademos-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-hagrid text-4xl md:text-5xl text-akademos-dark text-center mb-4">
            Conheça Nossas Telas
          </h2>
          <p className="font-poppins text-lg text-akademos-gray text-center mb-12">
            Explore os mockups das principais funcionalidades da plataforma
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockups.map((mockup, index) => (
              <MockupCard
                key={index}
                title={mockup.title}
                subtitle={mockup.subtitle}
                onViewMockup={() => {
                  // Lógica para visualizar mockup será implementada futuramente
                  console.log(`Visualizar mockup: ${mockup.title}`)
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-akademos-dark to-akademos-medium">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-hagrid text-4xl md:text-5xl text-akademos-white mb-6">
            Pronto para começar?
          </h2>
          <p className="font-poppins text-xl text-akademos-cream mb-8">
            Junte-se à comunidade AKADEMOS e transforme conhecimento em conexão
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="text-lg px-8 py-4">
              Criar Conta
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4 bg-transparent border-akademos-cream text-akademos-cream hover:bg-akademos-cream hover:text-akademos-dark">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
