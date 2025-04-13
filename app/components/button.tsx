import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { GalaxyIcon } from './icons';

interface GlassmorphismButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const GlassmorphismButton: React.FC<GlassmorphismButtonProps> = ({
  children,
  className = '',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        rounded-md
        font-medium
        backdrop-filter
        backdrop-blur-3xl
        ring-1 ring-[#faf0e0]/40
        transition-all
        duration-500
        focus:outline-none
        focus:ring-2
        focus:ring-[#faf0e0]/30
        active:scale-[0.98]
        bg-[#faf0e0]/30 hover:bg-[#faf0e0]/40
        shadow-md shadow-[#003674]/20 hover:shadow-[#003674]/30
        text-[#003674]
        py-2
        px-3
        ${(disabled || loading) ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...rest}
    >
      <GalaxyIcon loading={loading} className='w-8 h-8 mr-2' />
      Explore
    </button>
  );
};
