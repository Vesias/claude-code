import { useCallback, useEffect, useRef } from 'react';

interface SparklineOptions {
  color: string;
  lineWidth?: number;
  blur?: number;
}

export function useSparkline(data: number[], options: SparklineOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.lineWidth || 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Add glow effect
    if (options.blur) {
      ctx.shadowColor = options.color;
      ctx.shadowBlur = options.blur;
      ctx.stroke();
    }
  }, [data, options]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      draw(canvas);
    });
    
    observer.observe(canvas);
    draw(canvas);

    return () => observer.disconnect();
  }, [draw]);

  return canvasRef;
}
