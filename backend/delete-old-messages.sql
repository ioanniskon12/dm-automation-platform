-- Delete all events where payload doesn't contain attachments
-- This will allow the sync to reimport them with attachments
DELETE FROM "Event" 
WHERE payload::jsonb ? 'messageId' 
  AND NOT (payload::jsonb ? 'attachments');
