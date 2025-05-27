import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useSparkline } from '@/hooks/use-sparkline';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  data: number[];
  color: string;
  index: number;
}

export function MetricCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  data,
  color,
  index
}: MetricCardProps) {
  const sparklineRef = useSparkline(data, {
    color,
    lineWidth: 2,
    blur: 10
  });

  return (
    <motion.div
      className="bg-gray-900/60 rounded-xl p-5 border border-gray-700/50 hover:border-green-500/30 transition-all relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      role="article"
      aria-label={`${label} metrics`}
    >
      {/* Animated gradient border */}
      <div 
        className="absolute inset-0 rounded-xl opacity-20"
        style={{
          background: `linear-gradient(45deg, transparent, ${color}80, transparent)`,
          backgroundSize: '200% 200%',
          animation: 'gradient 2s ease infinite'
        }}
      />
      
      {/* Animated progress bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform scale-x-0 animate-[metricLoad_2s_ease-out_forwards]" 
        style={{ 
          backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDelay: `${index * 0.2}s` 
        }} 
      />
      
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
        <canvas
          ref={sparklineRef}
          width={60}
          height={30}
          className="opacity-60"
          role="img"
          aria-label={`${label} trend chart`}
        />
      </div>
      
      <div className="text-xs text-gray-400 mb-2">
        {label}
      </div>
      
      <div 
        className="text-2xl font-bold mb-1"
        style={{ 
          background: `linear-gradient(90deg, ${color}, #60A5FA)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {value}
      </div>
      
      <div className={`text-xs ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </motion.div>
  );
}
