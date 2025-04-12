"use client"

import { motion, Variants } from "motion/react"

export function Loader({ className }: { className: string }) {
  const dotVariants: Variants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="container"
    >
      <motion.div className={className} variants={dotVariants} />
      <motion.div className={className} variants={dotVariants} />
      <motion.div className={className} variants={dotVariants} />
      <style>
        {`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        `}
      </style>
    </motion.div>
  )
}


