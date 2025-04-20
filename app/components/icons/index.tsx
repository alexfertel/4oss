import { motion } from "motion/react";

import type { JSX } from "react";

export interface IconProps {
  className?: string;
}

export interface GalaxyIconProps extends IconProps {
  rotate?: boolean;
}

export function GalaxyIcon({
  className,
  rotate = true,
}: GalaxyIconProps): JSX.Element {
  return rotate ? (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`${className}`}
      initial={{ rotate: 0 }}
      animate={{ rotate: -360 }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
    >
      <motion.rect
        initial={{ rotate: 0 }}
        animate={{ rotate: -720 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        x="9.76"
        y="9.76"
        width="4.49"
        height="4.49"
        rx=".78"
        ry=".78"
        transform="translate(12 -4.97) rotate(45)"
      />
      <ellipse cx="12" cy="1.78" rx="1.25" ry="1.24" />
      <circle cx="3.08" cy="17.15" r="1.25" />
      <circle cx="20.92" cy="17.15" r="1.25" />
      <path d="M19.78,16.76" />
      <path d="M22.14,17.58" />
      <path d="M21.15,13.58" />
      <path d="M7.28,15.68" />
      <path d="M13.67,6.57c.79-.34,1.67-.53,2.59-.53,3.6,0,6.51,2.92,6.51,6.51,0,.61-.08,1.21-.24,1.77" />
      <path d="M6.18,14.32c-.98-.55-1.83-1.37-2.44-2.42-1.8-3.12-.73-7.1,2.38-8.9.87-.5,1.81-.78,2.75-.85" />
      <path d="M16.57,16.04c-.14,2.1-1.29,4.09-3.24,5.22-2.88,1.66-6.49.88-8.45-1.71" />
    </motion.svg>
  ) : (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`${className}`}
    >
      <motion.rect
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        x="9.76"
        y="9.76"
        width="4.49"
        height="4.49"
        rx=".78"
        ry=".78"
        transform="translate(12 -4.97) rotate(45)"
      />
      <ellipse cx="12" cy="1.78" rx="1.25" ry="1.24" />
      <circle cx="3.08" cy="17.15" r="1.25" />
      <circle cx="20.92" cy="17.15" r="1.25" />
      <path d="M19.78,16.76" />
      <path d="M22.14,17.58" />
      <path d="M21.15,13.58" />
      <path d="M7.28,15.68" />
      <path d="M13.67,6.57c.79-.34,1.67-.53,2.59-.53,3.6,0,6.51,2.92,6.51,6.51,0,.61-.08,1.21-.24,1.77" />
      <path d="M6.18,14.32c-.98-.55-1.83-1.37-2.44-2.42-1.8-3.12-.73-7.1,2.38-8.9.87-.5,1.81-.78,2.75-.85" />
      <path d="M16.57,16.04c-.14,2.1-1.29,4.09-3.24,5.22-2.88,1.66-6.49.88-8.45-1.71" />
    </motion.svg>
  );
}
