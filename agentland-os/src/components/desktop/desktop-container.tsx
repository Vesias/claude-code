'use client';

import { useEffect, useState } from 'react';
import { useDesktopStore } from '@/store/desktop-store';
import { DesktopIcon } from './desktop-icon';
import { WindowManager } from './window-manager';
import { Taskbar } from './taskbar';

export function DesktopContainer() {
  const apps = useDesktopStore((state) => state.apps);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 overflow-hidden">
      {/* Desktop Wallpaper Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Desktop Icons Grid */}
      <div className="absolute inset-0 p-4 pb-16">
        <div className="grid grid-cols-8 gap-2 w-fit">
          {apps.slice(0, 8).map((app) => (
            <DesktopIcon key={app.id} app={app} />
          ))}
        </div>
      </div>
      
      {/* Window Manager */}
      <WindowManager />
      
      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}