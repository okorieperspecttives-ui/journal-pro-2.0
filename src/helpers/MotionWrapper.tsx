// MotionWrapper.tsx
import { motion, easeOut } from "framer-motion";
import { type ReactNode } from "react";

const pageVariants = {
  initial: { opacity: 0, x: -50 }, // start slightly off-screen to the left
  animate: { opacity: 1, x: 0 }, // slide into place
  exit: { opacity: 0, x: 50 }, // slide out to the right
};

const pageTransition = {
  duration: 0.5,
  ease: easeOut,
};

interface MotionWrapperProps {
  children: ReactNode;
}

export default function MotionWrapper({ children }: MotionWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full pb-20 bg-background dark:bg-background-dark"
    >
      {children}
    </motion.div>
  );
}
