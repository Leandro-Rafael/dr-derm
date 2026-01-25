import React from 'react'
import { Button } from './Button'

interface MockupCardProps {
  title: string
  subtitle: string
  imageUrl?: string
  imageAlt?: string
  onViewMockup?: () => void
}

/**
 * Card de mockup
 * Exibe um mockup de tela com título, subtítulo e botão de ação
 */
export const MockupCard: React.FC<MockupCardProps> = ({
  title,
  subtitle,
  imageUrl,
  imageAlt = 'Mockup da funcionalidade',
  onViewMockup,
}) => {
  return (
    <div className="bg-akademos-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Imagem do mockup */}
      <div className="w-full h-64 bg-gradient-to-br from-akademos-dark to-akademos-medium flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-akademos-cream text-center p-4">
            <div className="text-6xl mb-2">📱</div>
            <p className="font-poppins text-sm opacity-75">Mockup ilustrativo</p>
          </div>
        )}
      </div>
      
      {/* Conteúdo do card */}
      <div className="p-6">
        <h3 className="font-hagrid text-xl text-akademos-dark mb-2">
          {title}
        </h3>
        <p className="font-poppins text-sm text-akademos-gray mb-4">
          {subtitle}
        </p>
        <Button
          variant="primary"
          onClick={onViewMockup}
          className="w-full"
        >
          Ver Mockup
        </Button>
      </div>
    </div>
  )
}
