import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

/**
 * Botão primário AKADEMOS
 * Componente reutilizável seguindo a identidade visual da marca
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-poppins font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-akademos-dark text-akademos-white hover:bg-akademos-medium focus:ring-akademos-medium',
    secondary: 'bg-akademos-medium text-akademos-white hover:bg-akademos-dark focus:ring-akademos-dark',
    outline: 'border-2 border-akademos-dark text-akademos-dark hover:bg-akademos-dark hover:text-akademos-white focus:ring-akademos-dark',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
