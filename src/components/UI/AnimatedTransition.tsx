
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimatedTransitionProps = {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
  direction?: 'left' | 'right';
};

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  isVisible,
  className,
  direction = 'right',
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            x: direction === 'right' ? 20 : -20 
          }}
          animate={{ 
            opacity: 1, 
            x: 0 
          }}
          exit={{ 
            opacity: 0, 
            x: direction === 'right' ? -20 : 20,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className={cn('w-full', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedTransition;
