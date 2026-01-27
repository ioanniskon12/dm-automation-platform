import AdminLayoutClient from './AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
