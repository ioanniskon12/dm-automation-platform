'use client';

import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import { BrandChannelProvider } from '../contexts/BrandChannelContext'
import { SidebarProvider } from '../contexts/SidebarContext'
import CookieConsent from '../components/CookieConsent'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DarkModeProvider>
          <AuthProvider>
            <BrandChannelProvider>
              <SidebarProvider>
                {children}
                <CookieConsent />
              </SidebarProvider>
            </BrandChannelProvider>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
