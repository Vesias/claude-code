'use client';

import { cn } from '@/lib/utils';
import { useDesktopStore } from '@/store/desktop-store';
import { Home, Grid3x3 } from 'lucide-react';
import { useState } from 'react';

export function Taskbar() {
  const { windows, activeWindowId, setActiveWindow, restoreWindow } = useDesktopStore();
  const [showAppMenu, setShowAppMenu] = useState(false);
  const apps = useDesktopStore((state) => state.apps);
  const openWindow = useDesktopStore((state) => state.openWindow);
  
  const handleTaskClick = (windowId: string, isMinimized: boolean) => {
    if (isMinimized) {
      restoreWindow(windowId);
    }
    setActiveWindow(windowId);
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
      <div className="h-full flex items-center px-2">
        {/* Start Button */}
        <button
          className={cn(
            'h-9 px-3 rounded flex items-center space-x-2',
            'bg-gray-800 hover:bg-gray-700 transition-colors',
            showAppMenu ? 'bg-gray-700' : ''
          )}
          onClick={() => setShowAppMenu(!showAppMenu)}
        >
          <Grid3x3 className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-gray-300">Apps</span>
        </button>
        
        {/* App Menu */}
        {showAppMenu && (
          <div className="absolute bottom-14 left-2 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-2">
            <div className="grid grid-cols-4 gap-2 w-96">
              {apps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center p-3 rounded hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    openWindow(app);
                    setShowAppMenu(false);
                  }}
                >
                  <span className="text-2xl mb-1">{app.icon}</span>
                  <span className="text-xs text-gray-400 text-center">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Separator */}
        <div className="w-px h-8 bg-gray-700 mx-2" />
        
        {/* Task List */}
        <div className="flex-1 flex items-center space-x-1">
          {windows.map((window) => (
            <button
              key={window.id}
              className={cn(
                'h-9 px-3 rounded flex items-center space-x-2 max-w-xs',
                'transition-colors',
                activeWindowId === window.id
                  ? 'bg-gray-700 border border-gray-600'
                  : 'bg-gray-800 hover:bg-gray-700',
                window.isMinimized ? 'opacity-60' : ''
              )}
              onClick={() => handleTaskClick(window.id, window.isMinimized)}
            >
              {window.icon && <span className="text-sm">{window.icon}</span>}
              <span className="text-sm text-gray-300 truncate">{window.title}</span>
            </button>
          ))}
        </div>
        
        {/* System Tray */}
        <div className="flex items-center space-x-3 px-3">
          <span className="text-xs text-gray-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}