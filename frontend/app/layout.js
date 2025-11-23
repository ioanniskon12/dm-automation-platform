'use client';

import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import { BrandChannelProvider } from '../contexts/BrandChannelContext'
import { SidebarProvider } from '../contexts/SidebarContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DarkModeProvider>
          <AuthProvider>
            <BrandChannelProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </BrandChannelProvider>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
