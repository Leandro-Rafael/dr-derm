import React from 'react'

interface FeatureCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

/**
 * Card de funcionalidade
 * Exibe uma funcionalidade da plataforma em formato de card
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="bg-akademos-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-akademos-cream">
      {icon && (
        <div className="mb-4 text-akademos-medium text-4xl">
          {icon}
        </div>
      )}
      <h3 className="font-hagrid text-xl text-akademos-dark mb-2">
        {title}
      </h3>
      {description && (
        <p className="font-poppins text-sm text-akademos-gray">
          {description}
        </p>
      )}
    </div>
  )
}
