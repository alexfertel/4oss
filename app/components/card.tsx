import React, { ReactNode } from "react";
import * as motion from "motion/react-client";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
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
    </motion.div>
  );
};
