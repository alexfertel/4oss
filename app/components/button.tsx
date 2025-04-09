import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface GlassmorphismButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GlassmorphismButton: React.FC<GlassmorphismButtonProps> = ({
  children,
  className = '',
  size = 'md',
  type = 'button',
  disabled = false,
  ...rest
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        relative
        rounded-md
        font-medium
        backdrop-filter
        backdrop-blur-3xl
        ring-1 ring-white/20
        transition-all
        duration-100
        focus:outline-none
        focus:ring-2
        focus:ring-white/30
        active:scale-[0.98]
        bg-white/10 text-white hover:bg-white/20
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};
