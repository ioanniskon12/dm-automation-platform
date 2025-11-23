"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const pathname = usePathname();

  // Collapse sidebar by default on flows page
  const [isCollapsed, setIsCollapsed] = useState(pathname === '/flows');

  // Update collapse state when navigating to/from flows page
  useEffect(() => {
    if (pathname === '/flows') {
      setIsCollapsed(true);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
