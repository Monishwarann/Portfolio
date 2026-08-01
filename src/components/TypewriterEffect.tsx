import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
  words: string[];
  className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ words, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={className}
    >
      <Typewriter
        words={words}
        loop={0} // Infinite loop
        cursor
        cursorStyle='|'
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={2000}
        cursorColor="#06b6d4"
      />
    </motion.div>
  );
};

export default TypewriterEffect;