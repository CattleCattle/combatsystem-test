// Animations pour les composants du jeu
import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideInUp: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const bounce: Variants = {
  idle: { y: 0 },
  bounce: { 
    y: [-10, 0], 
    transition: { 
      duration: 0.5, 
      repeat: Infinity, 
      repeatType: "reverse" 
    }
  }
};

export const shake: Variants = {
  idle: { x: 0 },
  shake: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  }
};

export const pulse: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, repeat: Infinity }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Animations spécifiques au combat
export const damageFlash: Variants = {
  idle: { 
    backgroundColor: "transparent",
    scale: 1
  },
  damage: {
    backgroundColor: ["transparent", "#ff0000", "transparent"],
    scale: [1, 1.1, 1],
    transition: { duration: 0.5 }
  }
};

export const healGlow: Variants = {
  idle: { 
    boxShadow: "0 0 0 rgba(34, 197, 94, 0)",
    scale: 1
  },
  heal: {
    boxShadow: [
      "0 0 0 rgba(34, 197, 94, 0)",
      "0 0 20px rgba(34, 197, 94, 0.6)",
      "0 0 0 rgba(34, 197, 94, 0)"
    ],
    scale: [1, 1.05, 1],
    transition: { duration: 0.8 }
  }
};

export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  tap: { scale: 0.95 }
};
