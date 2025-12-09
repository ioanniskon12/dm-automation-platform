// Simple in-memory data store for demo purposes
// In production, use a real database (PostgreSQL, MongoDB, etc.)

// Use globalThis to ensure the Map is shared across all API routes
if (!globalThis.users) {
  globalThis.users = new Map();

  // Pre-seed admin users
  globalThis.users.set('gianniskon12@gmail.com', {
    id: 'admin-1',
    name: 'Giannis',
    email: 'gianniskon12@gmail.com',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  });

  globalThis.users.set('sotiris040197@gmail.com', {
    id: 'admin-2',
    name: 'Sotiris',
    email: 'sotiris040197@gmail.com',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  });
}

if (!globalThis.brands) {
  globalThis.brands = new Map();

  // Create demo brands with channels
  const demoBrand1 = {
    id: 'brand-1',
    name: 'Perfect U',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
    channels: [
      { id: 'ch-1', type: 'instagram', status: 'connected', accountName: '@perfectu_official' },
      { id: 'ch-2', type: 'facebook', status: 'connected', accountName: 'Perfect U Page' },
      { id: 'ch-3', type: 'whatsapp', status: 'disconnected', accountName: null },
      { id: 'ch-4', type: 'telegram', status: 'disconnected', accountName: null },
      { id: 'ch-5', type: 'sms', status: 'disconnected', accountName: null },
      { id: 'ch-6', type: 'tiktok', status: 'disconnected', accountName: null },
    ]
  };

  const demoBrand2 = {
    id: 'brand-2',
    name: 'TechStartup',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
    channels: [
      { id: 'ch-7', type: 'instagram', status: 'connected', accountName: '@techstartup' },
      { id: 'ch-8', type: 'facebook', status: 'disconnected', accountName: null },
      { id: 'ch-9', type: 'whatsapp', status: 'connected', accountName: '+1234567890' },
      { id: 'ch-10', type: 'telegram', status: 'disconnected', accountName: null },
      { id: 'ch-11', type: 'sms', status: 'disconnected', accountName: null },
      { id: 'ch-12', type: 'tiktok', status: 'disconnected', accountName: null },
    ]
  };

  globalThis.brands.set('brand-1', demoBrand1);
  globalThis.brands.set('brand-2', demoBrand2);
}

export const users = globalThis.users;
export const brands = globalThis.brands;
