import React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'gold';
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  id,
  variant = 'default',
  hover = true,
  onClick
}) => {
  return (
    <div 
      id={id}
      onClick={onClick}
      className={cn(
        variant === 'gold' ? 'glass-gold' : 'glass',
        'rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:border-white/20 hover:bg-white/10',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
