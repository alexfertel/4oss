import React, { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
}) => {

  return (
    <div
      className={`
        relative
        rounded-md
        bg-white/10
        backdrop-filter
        backdrop-blur-3xl
        ring ring-white/20
        ${className}
      `}
    >
      {children}
    </div>
  );
};
