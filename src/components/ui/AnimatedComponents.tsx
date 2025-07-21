// Composants UI réutilisables avec animations

import React from 'react';
import { motion } from 'framer-motion';
import { buttonHover, scaleIn } from '../../utils/animations';

interface AnimatedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
}

export function AnimatedButton({ 
  onClick, 
  children, 
  className = "", 
  variant = 'primary',
  disabled = false 
}: AnimatedButtonProps) {
  const baseStyles = "font-bold py-2 px-4 rounded-lg transition-colors";
  
  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <motion.button
      variants={buttonHover}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : "tap"}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </motion.button>
  );
}

interface HealthBarProps {
  current: number;
  max: number;
  className?: string;
  showText?: boolean;
}

export function AnimatedHealthBar({ 
  current, 
  max, 
  className = "", 
  showText = true 
}: HealthBarProps) {
  const percentage = (current / max) * 100;
  
  const getColor = () => {
    if (percentage > 66) return "bg-green-500";
    if (percentage > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showText && (
        <motion.div 
          className="text-center text-sm mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {current}/{max}
        </motion.div>
      )}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  onClick,
  hoverable = false 
}: CardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`bg-white rounded-lg shadow-lg p-4 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface FloatingTextProps {
  text: string;
  type: 'damage' | 'heal' | 'info';
  onComplete?: () => void;
}

export function FloatingText({ text, type, onComplete }: FloatingTextProps) {
  const colors = {
    damage: "text-red-500",
    heal: "text-green-500",
    info: "text-blue-500",
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -50, opacity: 0, scale: 1.2 }}
      transition={{ duration: 1, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className={`absolute font-bold text-xl ${colors[type]} pointer-events-none z-50`}
    >
      {text}
    </motion.div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingSpinner({ size = 'md', color = 'blue-500' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`border-2 border-gray-300 border-t-${color} rounded-full ${sizes[size]}`}
    />
  );
}
