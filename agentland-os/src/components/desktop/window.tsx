'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  children?: React.ReactNode;
  title: string;
  icon: React.ComponentType<any>;
  onClose: () => void;
  onFocus: () => void;
  initialPosition: { x: number; y: number };
  style?: React.CSSProperties;
}

export function Window({ 
  children,
  title,
  icon: Icon,
  onClose,
  onFocus,
  initialPosition,
  style = {}
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [size] = useState({ width: 600, height: 400 });
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isMaximized) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPosition({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    onFocus();
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
    if (isMaximized) {
      setPosition(initialPosition);
    }
  };
  
  const contentStyle = {
    ...style,
    left: isMaximized ? 0 : position.x,
    top: isMaximized ? 0 : position.y,
    width: isMaximized ? '100%' : size.width,
    height: isMaximized ? '100%' : size.height,
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        'fixed bg-gray-900/95 backdrop-blur-md border border-gray-700/50',
        'rounded-lg overflow-hidden shadow-2xl transition-transform',
        isMaximized ? 'inset-0 rounded-none' : ''
      )}
      style={contentStyle}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-medium">{title}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-1 hover:bg-gray-700/50 rounded-md transition-colors"
            onClick={handleMaximizeToggle}
          >
            <Square className="w-4 h-4 text-gray-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-700/50 rounded-md transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4 h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>
    </div>
  );
}