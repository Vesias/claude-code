'use client';

import { useDesktopStore } from '@/store/desktop-store';
import { Window } from './window';

export function WindowManager() {
  const windows = useDesktopStore((state) => state.windows);
  
  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}
    </>
  );
}