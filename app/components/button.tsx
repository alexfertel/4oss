import React, { ReactNode, ButtonHTMLAttributes } from "react";
import { GalaxyIcon } from "./icons";

interface GlassmorphismButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon: ReactNode;
}

export const GlassmorphismButton: React.FC<GlassmorphismButtonProps> = ({
  children,
  className = "",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  icon = null,
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
        font-bold
        backdrop-filter
        backdrop-blur-3xl
        ring-1 ring-[#faf0e0]/80
        transition-all
        duration-500
        focus:outline-none
        focus:ring-2
        focus:ring-[#faf0e0]/30
        active:scale-[0.98]
        bg-[#faf0e0]/30 hover:bg-[#faf0e0]/40
        text-zinc-500
        py-2
        px-3
        ${disabled || loading ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...rest}
    >
      {icon}
      Explore
    </button>
  );
};
