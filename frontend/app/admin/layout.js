"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdminShell from './_components/admin-shell';

// Super admin email(s) - add your email here or use env variable
// You can also set NEXT_PUBLIC_ADMIN_EMAILS in .env.local (comma-separated)
const envAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
const ALLOWED_ADMIN_EMAILS = [
  ...envAdminEmails,
  'gianniskon12@gmail.com',
  'sotiris040197@gmail.com',
];

// Check if user is an admin
const isAdmin = (email) => {
  // If no admin emails configured, allow any authenticated user (dev mode)
  if (ALLOWED_ADMIN_EMAILS.length === 0) {
    return true;
  }
  return ALLOWED_ADMIN_EMAILS.includes(email);
};

export default function AdminLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Not an admin - redirect to dashboard
      if (!isAdmin(user?.email)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not authorized - show nothing while redirecting
  if (!isAuthenticated || !isAdmin(user?.email)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
