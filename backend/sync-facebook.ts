// CLI script to sync Facebook conversations
import facebookSyncService from './src/services/facebook-sync.service.js';

async function main() {
  console.log('🚀 Starting Facebook sync...\n');
  await facebookSyncService.syncAllConversations();
  console.log('\n✅ Sync complete!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
