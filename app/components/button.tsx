import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassmorphismButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean; // New loading prop
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
  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  // Icon sizes based on button size
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

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
        ring-1 ring-white/40
        transition-all
        duration-100
        focus:outline-none
        focus:ring-2
        focus:ring-white/30
        active:scale-[0.98]
        bg-white/30 hover:bg-white/20
        text-[#ffc379]
        ${sizeStyles[size]}
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...rest}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.svg
            key="loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.3,
              rotate: {
                repeat: Infinity,
                ease: "linear",
                duration: 1
              }
            }}
            className={`${iconSizes[size]}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              strokeDasharray="60 85"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="telescope"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className={`${iconSizes[size]}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 6v12l15-6L5 6z" />
          </motion.svg>
        )}
      </AnimatePresence>
      {children && (
        <span className={`ml-2 transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"}`}>
          {children}
        </span>
      )}
    </button>
  );
};
