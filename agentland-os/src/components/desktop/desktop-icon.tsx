'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function DesktopIcon({ icon: Icon, label, onClick, className }: DesktopIconProps) {
  
  return (
    <button
      className={cn(
        'flex flex-col items-center justify-center p-2 rounded-lg',
        'hover:bg-white/10 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-white/20',
        'group cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">
        <Icon />
      </div>
      <span className="text-xs text-white/90 text-center select-none">
        {label}
      </span>
    </button>
  );
}