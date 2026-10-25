import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CloudWipeTransitionProps {
  children: React.ReactNode;
  pageKey?: string;
}

/**
 * CloudWipeTransition: 350ms joyful spring/zoom page transition wrapper.
 * Honors prefers-reduced-motion with subtle opacity crossfade.
 */
export const CloudWipeTransition: React.FC<CloudWipeTransitionProps> = ({ children, pageKey }) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <motion.div
        key={pageKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full relative z-10"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.02, y: -10 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="w-full relative z-10"
    >
      {children}
    </motion.div>
  );
};
