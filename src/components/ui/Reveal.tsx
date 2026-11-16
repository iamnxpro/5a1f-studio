import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotion } from "@/contexts/MotionContext";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Keep stagger under 0.2s to avoid a sluggish page. */
  delay?: number;
  y?: number;
};

/**
 * A small, accessible entrance animation. When the visitor disables motion
 * (or the OS asks for reduced motion) the children render immediately with no
 * wrapper animation and no hidden state.
 */
export function Reveal({ children, className, delay = 0, y = 22 }: RevealProps) {
  const { motionEnabled } = useMotion();

  if (!motionEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -48px 0px" }}
      transition={{
        duration: 0.62,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
