import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Window {
  id: string;
  title: string;
  icon?: string;
  content: React.ComponentType<any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  content: React.ComponentType<any>;
}

interface DesktopStore {
  windows: Window[];
  activeWindowId: string | null;
  highestZIndex: number;
  apps: DesktopApp[];
  
  // Window actions
  openWindow: (app: DesktopApp) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 1,
  apps: [
    { id: 'bash', name: 'Bash Terminal', icon: '🖥️', content: () => null },
    { id: 'glob', name: 'File Glob', icon: '🔍', content: () => null },
    { id: 'grep', name: 'Grep Search', icon: '🔎', content: () => null },
    { id: 'ls', name: 'List Files', icon: '📁', content: () => null },
    { id: 'read', name: 'File Reader', icon: '📄', content: () => null },
    { id: 'edit', name: 'File Editor', icon: '✏️', content: () => null },
    { id: 'multiedit', name: 'Multi Editor', icon: '📝', content: () => null },
    { id: 'write', name: 'File Writer', icon: '💾', content: () => null },
    { id: 'notebook', name: 'Jupyter Notebook', icon: '📓', content: () => null },
    { id: 'webfetch', name: 'Web Fetch', icon: '🌐', content: () => null },
    { id: 'websearch', name: 'Web Search', icon: '🔍', content: () => null },
    { id: 'todo', name: 'Todo Manager', icon: '✅', content: () => null },
    { id: 'diagnostics', name: 'VS Code Diagnostics', icon: '🔧', content: () => null },
  ],
  
  openWindow: (app) => set((state) => {
    const newWindow: Window = {
      id: uuidv4(),
      title: app.name,
      icon: app.icon,
      content: app.content,
      position: { x: 100 + state.windows.length * 30, y: 100 + state.windows.length * 30 },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false,
      zIndex: state.highestZIndex + 1,
    };
    
    return {
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      highestZIndex: state.highestZIndex + 1,
    };
  }),
  
  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),
  
  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ),
  })),
  
  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, isMaximized: true } : w
    ),
  })),
  
  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, isMinimized: false, isMaximized: false } : w
    ),
  })),
  
  setActiveWindow: (id) => set((state) => {
    const newZIndex = state.highestZIndex + 1;
    return {
      windows: state.windows.map(w => 
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      highestZIndex: newZIndex,
    };
  }),
  
  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, position } : w
    ),
  })),
  
  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, size } : w
    ),
  })),
}));