"use client";

import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import Link from 'next/link';
import axios from 'axios';
import NavigationSidebar from '../../components/NavigationSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Channel logo components
const ChannelIcon = ({ type, className = "w-4 h-4" }) => {
  const icons = {
    instagram: (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#F58529'}} />
            <stop offset="25%" style={{stopColor: '#DD2A7B'}} />
            <stop offset="50%" style={{stopColor: '#8134AF'}} />
            <stop offset="100%" style={{stopColor: '#515BD4'}} />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)" />
        <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6z" fill="white" />
        <circle cx="17" cy="7" r="1" fill="white" />
        <path d="M16.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3z" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    facebook: (
      <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    whatsapp: (
      <svg className={className} viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    telegram: (
      <svg className={className} viewBox="0 0 24 24" fill="#0088cc">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    sms: (
      <svg className={className} viewBox="0 0 24 24" fill="#4CAF50">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
      </svg>
    ),
    tiktok: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    )
  };

  return icons[type] || null;
};

// Mock chat data for preview
const mockMessages = [
  {
    id: '1',
    senderName: 'John Smith',
    senderUsername: '@johnsmith',
    channelType: 'instagram',
    platform: 'Instagram',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
    time: '2 min ago',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    lastMessage: 'Hey! I saw your product on Instagram and I\'m interested in learning more...',
    isRead: false,
    automated: false,
    conversation: [
      { text: 'Hey! I saw your product on Instagram and I\'m interested in learning more...', isUser: false, timestamp: '2:35 PM' },
    ]
  },
  {
    id: '2',
    senderName: 'Sarah Johnson',
    senderUsername: '@sarahj',
    channelType: 'facebook',
    platform: 'Facebook',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    time: '15 min ago',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    lastMessage: 'Thank you for the quick response! I\'ll take 3 of those.',
    isRead: false,
    automated: true,
    conversation: [
      { text: 'Hi, do you have this in stock?', isUser: false, timestamp: '2:15 PM' },
      { text: 'Yes! We have it available in all sizes.', isUser: true, timestamp: '2:16 PM' },
      { text: 'Thank you for the quick response! I\'ll take 3 of those.', isUser: false, timestamp: '2:20 PM' },
    ]
  },
  {
    id: '3',
    senderName: 'Mike Chen',
    senderUsername: '+1234567890',
    channelType: 'whatsapp',
    platform: 'WhatsApp',
    profilePicture: 'https://i.pravatar.cc/150?img=33',
    time: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    lastMessage: 'Perfect! Can you send me the payment link?',
    isRead: true,
    automated: false,
    conversation: [
      { text: 'Hi! Is this still available?', isUser: false, timestamp: '1:00 PM' },
      { text: 'Yes it is! Would you like to purchase?', isUser: true, timestamp: '1:05 PM' },
      { text: 'Perfect! Can you send me the payment link?', isUser: false, timestamp: '1:10 PM' },
    ]
  },
  {
    id: '4',
    senderName: 'Emma Wilson',
    senderUsername: '@emmaw',
    channelType: 'instagram',
    platform: 'Instagram',
    profilePicture: 'https://i.pravatar.cc/150?img=9',
    time: '3 hours ago',
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    lastMessage: 'Great! I\'ll follow you for updates.',
    isRead: true,
    automated: true,
    conversation: [
      { text: 'Love your content!', isUser: false, timestamp: '11:00 AM' },
      { text: 'Thank you so much! 🙏', isUser: true, timestamp: '11:15 AM' },
      { text: 'Great! I\'ll follow you for updates.', isUser: false, timestamp: '11:20 AM' },
    ]
  },
  {
    id: '5',
    senderName: 'David Martinez',
    senderUsername: '@davidm',
    channelType: 'telegram',
    platform: 'Telegram',
    profilePicture: 'https://i.pravatar.cc/150?img=15',
    time: '5 hours ago',
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    lastMessage: 'When is the next launch?',
    isRead: true,
    automated: false,
    conversation: [
      { text: 'When is the next launch?', isUser: false, timestamp: '9:00 AM' },
    ]
  },
  {
    id: '6',
    senderName: 'Lisa Anderson',
    senderUsername: '@lisaa',
    channelType: 'facebook',
    platform: 'Facebook',
    profilePicture: 'https://i.pravatar.cc/150?img=20',
    time: 'Yesterday',
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    lastMessage: 'I need help with my order #12345',
    isRead: true,
    automated: true,
    conversation: [
      { text: 'I need help with my order #12345', isUser: false, timestamp: 'Yesterday 3:00 PM' },
      { text: 'Of course! Let me look that up for you.', isUser: true, timestamp: 'Yesterday 3:05 PM' },
    ]
  },
];

export default function Inbox() {
  const { isCollapsed } = useSidebar();
  const { selectedChannel, getCurrentChannel } = useBrandChannel();
  const [messages, setMessages] = useState([]); // Start empty, fetch from API
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, automated, manual
  const [loading, setLoading] = useState(true); // Loading until we fetch real data
  const [replyText, setReplyText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sentImagePreviews, setSentImagePreviews] = useState({}); // Store blob URLs keyed by messageId
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new threads every 5 seconds to catch new chats quickly
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [filter, selectedChannel]);

  useEffect(() => {
    if (selectedConversation) {
      // Load conversation details and scroll to bottom on initial open
      loadConversationDetails(selectedConversation.id, true);
      // Clear the reply text when switching conversations
      setReplyText('');
      setSelectedFile(null);

      // Poll for new messages in the selected conversation every 3 seconds (backup for missed webhooks)
      const conversationInterval = setInterval(() => {
        loadConversationDetails(selectedConversation.id, false); // Don't scroll on polling
      }, 3000);

      return () => clearInterval(conversationInterval);
    }
  }, [selectedConversation?.id]); // Re-run when conversation ID changes

  const loadConversationDetails = async (threadId, scrollToBottom = false) => {
    try {
      const response = await axios.get(`/api/inbox/threads/${threadId}`);
      if (response.data.success) {
        const threadData = response.data.thread;

        // Transform messages to match UI format
        const transformedMessages = threadData.messages.map(msg => ({
          ...msg,
          isUser: msg.sender === 'business', // Our messages are from business
          timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })
        }));

        // Only update if conversation data actually changed
        const currentConversation = selectedConversation?.conversation || [];
        const hasNewMessages = transformedMessages.length > currentConversation.length;
        const hasChanged =
          transformedMessages.length !== currentConversation.length ||
          threadData.isTyping !== selectedConversation?.isTyping ||
          JSON.stringify(transformedMessages.map(m => ({ id: m.id, text: m.text, sender: m.sender }))) !==
          JSON.stringify(currentConversation.map(m => ({ id: m.id, text: m.text, sender: m.sender })));

        if (hasChanged) {
          // Update the selected conversation with full message history and typing status
          setSelectedConversation(prev => ({
            ...prev,
            conversation: transformedMessages,
            isTyping: threadData.isTyping || false,
          }));

          // Scroll to bottom when opening conversation OR when new messages arrive
          if (scrollToBottom || hasNewMessages) {
            setTimeout(() => {
              if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Only show loading on initial fetch
      if (messages.length === 0) {
        setLoading(true);
      }

      // Fetch threads from API
      const response = await axios.get('/api/inbox/threads');

      if (response.data.success) {
        const threads = response.data.threads || [];

        // Transform API threads to match frontend format
        const transformedMessages = threads.map(thread => ({
          id: thread.id,
          senderName: thread.user.name,
          senderUsername: thread.user.username,
          channelType: thread.platform,
          platform: thread.platform.charAt(0).toUpperCase() + thread.platform.slice(1),
          profilePicture: thread.user.avatar,
          time: formatTimestamp(thread.timestamp),
          timestamp: thread.timestamp,
          lastMessage: thread.lastMessage,
          isRead: !thread.unread,
          automated: false, // TODO: Determine if automated from flow executions
          conversation: [], // Will be loaded when conversation is selected
        }));

        // Only update if data has changed (compare without time field since it changes constantly)
        const newDataForComparison = transformedMessages.map(m => ({
          id: m.id,
          lastMessage: m.lastMessage,
          timestamp: m.timestamp,
          isRead: m.isRead,
        }));
        const currentDataForComparison = messages.map(m => ({
          id: m.id,
          lastMessage: m.lastMessage,
          timestamp: m.timestamp,
          isRead: m.isRead,
        }));

        const newDataString = JSON.stringify(newDataForComparison);
        const currentDataString = JSON.stringify(currentDataForComparison);

        if (newDataString !== currentDataString) {
          setMessages(transformedMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (messages.length === 0) {
        setLoading(false);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const renderMessageContent = (msg) => {
    // Check if message contains media
    const payload = msg.payload || {};

    // Handle attachments
    if (payload.attachments?.length > 0) {
      // Filter for images - handle multiple Facebook/Instagram formats
      const imageAttachments = payload.attachments.filter(att =>
        att.type?.toLowerCase() === 'image' ||              // Webhook format: type: 'image'
        att.type?.toLowerCase() === 'photo' ||
        att.mime_type?.startsWith('image/') ||              // Sync format: mime_type: 'image/jpeg'
        att.image_data?.url                                 // Sync format: image_data.url
      );
      const videoAttachments = payload.attachments.filter(att =>
        att.type?.toLowerCase() === 'video' ||
        att.mime_type?.startsWith('video/') ||
        att.video_data?.url
      );
      const fileAttachments = payload.attachments.filter(att =>
        att.type?.toLowerCase() === 'file' ||               // File attachments (PDF, docs, etc.)
        att.mime_type?.startsWith('application/') ||
        (att.payload?.url && !att.image_data && !att.video_data)
      );

      return (
        <div className="space-y-2">
          {imageAttachments.map((att, idx) => {
            // Try multiple possible URL locations - Facebook uses different formats
            // for webhook messages vs sync messages
            let imageUrl =
              att.payload?.url ||                    // Webhook format: payload.url (including blob URLs)
              att.image_data?.url ||                 // Sync format: image_data.url
              att.payload?.src ||                    // Alternative format
              att.payload?.image_data?.url ||        // Nested format
              att.payload?.sticker_url ||            // Sticker format
              att.payload?.preview_url ||            // Preview format
              att.media?.image?.src ||               // Instagram format
              null;

            // If no URL but has attachment_id, find the matching blob URL
            if (!imageUrl && att.payload?.attachment_id && msg.sender === 'business') {
              // First try to match by messageId (most reliable)
              const msgId = msg.payload?.messageId;
              if (msgId && sentImagePreviews[msgId]) {
                imageUrl = sentImagePreviews[msgId];
              } else {
                // Fall back to timestamp matching
                const msgTimestamp = new Date(msg.timestamp).getTime();

                // Find blob URL with closest timestamp (within 10 seconds)
                let closestMatch = null;
                let closestDiff = Infinity;

                Object.entries(sentImagePreviews).forEach(([key, blobUrl]) => {
                  const timestamp = parseInt(key);
                  if (!isNaN(timestamp)) {
                    const diff = Math.abs(timestamp - msgTimestamp);
                    if (diff < closestDiff && diff < 10000) { // Within 10 seconds
                      closestDiff = diff;
                      closestMatch = blobUrl;
                    }
                  }
                });

                if (closestMatch) {
                  imageUrl = closestMatch;
                }
              }
            }

            return imageUrl ? (
              <img
                key={idx}
                src={imageUrl}
                alt="Attachment"
                className="max-w-xs rounded-lg"
              />
            ) : (
              <div key={idx} className="max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">Image attachment</p>
              </div>
            );
          })}
          {videoAttachments.map((att, idx) => {
            // Try multiple possible URL locations - same as images
            let videoUrl =
              att.payload?.url ||                    // Webhook format
              att.video_data?.url ||                 // Sync format: video_data.url
              att.payload?.video_data?.url ||        // Nested format
              null;

            return videoUrl ? (
              <video
                key={idx}
                src={videoUrl}
                controls
                className="max-w-xs rounded-lg"
              />
            ) : (
              <div key={idx} className="max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">Video sent</p>
              </div>
            );
          })}
          {fileAttachments.map((att, idx) => {
            // Try multiple possible URL locations - same as images/videos
            let fileUrl =
              att.payload?.url ||                    // Webhook format
              att.file_url ||                        // Sync format: file_url
              att.file_data?.url ||                  // Alternative sync format
              null;

            // Extract filename from attachment or URL
            let fileName =
              att.name ||
              att.payload?.name ||
              fileUrl?.split('/').pop()?.split('?')[0] ||
              'Download File';

            return fileUrl ? (
              <a
                key={idx}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-xs p-4 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center space-x-3 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
              >
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-xs text-gray-500">Click to download</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ) : (
              <div key={idx} className="max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">File attachment</p>
              </div>
            );
          })}
          {msg.text && msg.text !== '[Media]' && <p className="text-sm">{msg.text}</p>}
        </div>
      );
    }

    // Regular text message (supports emojis automatically)
    return (
      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
    );
  };

  const sendReply = async (text) => {
    if (!text.trim() && !selectedFile) return;

    try {
      // Prepare form data for file upload
      const formData = new FormData();

      if (text.trim()) {
        formData.append('message', text);
      }

      // Create preview URL for immediate display
      let previewUrl = null;
      const sendTimestamp = Date.now();
      if (selectedFile) {
        formData.append('file', selectedFile);
        previewUrl = URL.createObjectURL(selectedFile);

        // Store blob URL with timestamp for matching later
        setSentImagePreviews(prev => ({
          ...prev,
          [sendTimestamp]: previewUrl
        }));
      }

      // Add message optimistically with preview
      const newMessage = {
        id: Date.now(),
        sender: 'business',
        text: text || '[Media]',
        isUser: true,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        payload: selectedFile ? {
          attachments: [{
            type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
            payload: { url: previewUrl }
          }]
        } : undefined
      };

      // Update UI immediately
      const updatedConversation = {
        ...selectedConversation,
        conversation: [...(selectedConversation.conversation || []), newMessage],
        lastMessage: text || '[Media]',
        time: 'Just now',
        timestamp: new Date().toISOString()
      };

      setSelectedConversation(updatedConversation);
      setReplyText('');
      setSelectedFile(null);

      // Send to API with file upload support
      const response = await axios.post(`/api/inbox/${selectedConversation.id}/reply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Store blob URL by messageId for better matching reliability
        if (previewUrl && response.data.messageId) {
          setSentImagePreviews(prev => ({
            ...prev,
            [response.data.messageId]: previewUrl
          }));
        }

        // Don't reload - keep the optimistic preview with blob URL
        // Just refresh the messages list to update last message
        fetchMessages();
      } else {
        console.error('Failed to send message:', response.data.error);
        alert('Failed to send message: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const markAsRead = async (conversation) => {
    try {
      await axios.post(`${API_URL}/api/inbox/${conversation.id}/mark-read`);

      // Update local state to mark as read immediately
      setMessages(prevMessages =>
        prevMessages.map(m =>
          m.id === conversation.id ? { ...m, isRead: true } : m
        )
      );

      // Also update selected conversation
      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation(prev => ({ ...prev, isRead: true }));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;
  const automatedCount = messages.filter(m => m.automated).length;

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900">
        <NavigationSidebar />

      <div className={`flex-1 flex overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Filters */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-2 py-1.5 border font-medium text-xs transition-all rounded-lg ${
                  filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 px-2 py-1.5 border font-medium text-xs transition-all rounded-lg ${
                  filter === 'unread' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setFilter('automated')}
                className={`flex-1 px-2 py-1.5 border font-medium text-xs transition-all rounded-lg ${
                  filter === 'automated' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                Auto ({automatedCount})
              </button>
              <button
                onClick={() => setFilter('manual')}
                className={`flex-1 px-2 py-1.5 border font-medium text-xs transition-all rounded-lg ${
                  filter === 'manual' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 dark:text-gray-500">Loading conversations...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No messages yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">New messages will appear here</p>
              </div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedConversation(msg);
                    if (!msg.isRead) markAsRead(msg);
                  }}
                  className={`w-full p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                    selectedConversation?.id === msg.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  } ${!msg.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {/* Avatar with unread indicator */}
                    <div className="relative">
                      {msg.profilePicture || msg.senderAvatar ? (
                        <img
                          src={msg.profilePicture || msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                          {msg.senderName?.charAt(0) || '?'}
                        </div>
                      )}
                      {!msg.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name with Channel Icon & Time */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm ${!msg.isRead ? 'font-bold' : 'font-semibold'} text-gray-900 dark:text-white`}>{msg.senderName}</span>
                          {msg.channelType && (
                            <ChannelIcon type={msg.channelType} className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
                      </div>

                      {/* Platform & Status */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                          {msg.platform}
                        </span>
                        {msg.automated && (
                          <span className="text-xs px-2 py-0.5 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-full">
                            Auto
                          </span>
                        )}
                      </div>

                      {/* Message Preview */}
                      <p className={`text-xs ${!msg.isRead ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'} truncate`}>{msg.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Content - Conversation */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedConversation.senderName}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedConversation.platform} • {selectedConversation.senderUsername}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedConversation.automated ? (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-xs font-semibold rounded-lg">
                        Automated
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-lg">
                        Manual
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {(!selectedConversation.conversation || selectedConversation.conversation.length === 0) && (
                  <div className="text-center text-gray-500 py-4">Loading messages...</div>
                )}
                {selectedConversation.conversation?.map((msg, idx) => {
                  // Get image/video URLs from attachments
                  const attachments = msg.payload?.attachments || [];
                  const imageUrl = attachments.find(a =>
                    a.type === 'image' || a.mime_type?.startsWith('image/') || a.image_data
                  );
                  const videoUrl = attachments.find(a =>
                    a.type === 'video' || a.mime_type?.startsWith('video/') || a.video_data
                  );

                  const imgSrc = imageUrl?.payload?.url || imageUrl?.image_data?.url;
                  const vidSrc = videoUrl?.payload?.url || videoUrl?.video_data?.url;

                  return (
                    <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        {/* Show image */}
                        {imgSrc && (
                          <img src={imgSrc} alt="Image" className="rounded-lg mb-2 max-w-full" />
                        )}
                        {/* Show video */}
                        {vidSrc && (
                          <video src={vidSrc} controls className="rounded-lg mb-2 max-w-full" />
                        )}
                        {/* Show text if not just [Media] or if no media found */}
                        {(msg.text && msg.text !== '[Media]') || (!imgSrc && !vidSrc) ? (
                          <p className="text-sm">{msg.text || '[Media]'}</p>
                        ) : null}
                        <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {selectedConversation.isTyping && (
                  <div className="flex justify-start gap-2">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {selectedConversation.profilePicture ? (
                        <img
                          src={selectedConversation.profilePicture}
                          alt={selectedConversation.senderName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {selectedConversation.senderName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>

                    {/* Typing Animation */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {selectedFile && (
                  <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="flex gap-2 relative">
                  {/* File Upload Button */}
                  <label className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </label>

                  {/* Emoji Picker Container */}
                  <div className="relative">
                    {/* Emoji Button */}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      title="Add emoji"
                    >
                      <span className="text-xl">😊</span>
                    </button>

                    {/* Emoji Picker Popup */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 w-72 z-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pick an emoji</h4>
                          <button
                            onClick={() => setShowEmojiPicker(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                          {['😊', '😂', '🤣', '❤️', '😍', '😘', '👍', '👏', '🙏', '💯', '🔥', '✨', '🎉', '🤔', '😢', '😭', '😡', '🤗', '🤩', '😎', '😴', '🥰', '😇', '🤪', '🧐', '🤨', '😐', '😑', '😶', '🙄', '😏', '😬', '🤐', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤯', '😳', '🥺', '😦', '😧', '😮', '😯', '😲', '😵', '🙃', '🙂', '😉', '😌', '😊', '🥳', '🥴'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setReplyText(replyText + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (replyText || selectedFile) && sendReply(replyText)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                  />

                  {/* Send Button */}
                  <button
                    onClick={() => sendReply(replyText)}
                    disabled={!replyText && !selectedFile}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-5xl mb-3">💬</div>
              <h3 className="text-lg font-bold mb-2 dark:text-gray-300">Select a conversation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose a message from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
