import { motion } from "framer-motion";

import {
  ReactNode,
} from "react";

type Props = {
  children: ReactNode;

  delay?: number;

  y?: number;

  duration?: number;

  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.8,
  className = "",
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration,
        delay,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={
        className
      }
    >

      {children}

    </motion.div>
  );
}