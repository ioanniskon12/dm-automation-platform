"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useBrandChannel } from '../../../contexts/BrandChannelContext';
import ChannelSelectorModal from '../../../components/ChannelSelectorModal';
import ProtectedRoute from '../../../components/ProtectedRoute';

// Channel configurations with limitations
const channelConfigs = {
  messenger: {
    name: 'Messenger',
    description: 'Message your Messenger contacts',
    limitations: '24-hour window applies for promotional content',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
    maxLength: 2000,
    supportsButtons: true,
    supportsQuickReplies: true,
    supportsMedia: true,
    unsubscribeMethod: '"Stop" quick reply or keyword',
  },
  facebook: {
    name: 'Facebook',
    description: 'Message your Facebook Page followers',
    limitations: '24-hour window applies for promotional content',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'from-blue-600 to-blue-700',
    maxLength: 2000,
    supportsButtons: true,
    supportsQuickReplies: true,
    supportsMedia: true,
    unsubscribeMethod: '"Stop" quick reply or keyword',
  },
  instagram: {
    name: 'Instagram',
    description: 'DM your Instagram eligible subscribers',
    limitations: '24-hour window - only eligible subscribers',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: 'from-pink-500 to-purple-500',
    maxLength: 1000,
    supportsButtons: true,
    supportsQuickReplies: true,
    supportsMedia: true,
    unsubscribeMethod: '"Stop" quick reply or keyword',
  },
  whatsapp: {
    name: 'WhatsApp',
    description: 'Broadcast to WhatsApp contacts',
    limitations: 'Requires approved templates outside 24h window',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: 'from-green-500 to-green-600',
    maxLength: 4096,
    supportsButtons: true,
    supportsQuickReplies: false,
    supportsMedia: true,
    requiresTemplate: true,
    unsubscribeMethod: 'Opt-out button in template',
  },
  telegram: {
    name: 'Telegram',
    description: 'Message your Telegram subscribers',
    limitations: 'No messaging restrictions',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color: 'from-sky-500 to-blue-500',
    maxLength: 4096,
    supportsButtons: true,
    supportsQuickReplies: true,
    supportsMedia: true,
    unsubscribeMethod: '/stop command',
  },
  email: {
    name: 'Email',
    description: 'Send email to your contacts',
    limitations: 'Requires valid email addresses',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-amber-500 to-orange-500',
    maxLength: 50000,
    supportsButtons: true,
    supportsQuickReplies: false,
    supportsMedia: true,
    unsubscribeMethod: 'Unsubscribe link',
  },
  sms: {
    name: 'SMS',
    description: 'Send SMS messages',
    limitations: '160 chars per segment, costs apply',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'from-gray-500 to-gray-600',
    maxLength: 1600,
    supportsButtons: false,
    supportsQuickReplies: false,
    supportsMedia: false,
    unsubscribeMethod: 'Reply STOP',
  },
};

// Available variables for personalization
const systemVariables = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
];

function NewBroadcastContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel, selectChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();

  const workspaceId = currentBrand?.id || searchParams.get('brand') || 'brand-1';
  const channelParam = currentChannel?.type || searchParams.get('channel'); // e.g., 'messenger', 'instagram'

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [showChannelSelector, setShowChannelSelector] = useState(false);

  // Form data
  const [broadcastId, setBroadcastId] = useState(null);
  const [broadcastName, setBroadcastName] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);

  // Content blocks
  const [contentBlocks, setContentBlocks] = useState([
    { id: '1', type: 'text', text: '' }
  ]);

  // Audience
  const [audienceFilters, setAudienceFilters] = useState([]);
  const [audienceStats, setAudienceStats] = useState({
    eligible: 0,
    notEligible: 0,
    total: 0,
    reasons: [],
  });
  const [loadingAudience, setLoadingAudience] = useState(false);

  // Schedule
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Preflight checks
  const [preflightChecks, setPreflightChecks] = useState({
    audienceSize: false,
    unsubscribeOption: false,
    contentValid: false,
  });

  // Unsubscribe toggle
  const [includeUnsubscribe, setIncludeUnsubscribe] = useState(false);

  // Tags for filtering
  const [tags, setTags] = useState([]);
  const [customFields, setCustomFields] = useState([]);

  // Load connected channels
  useEffect(() => {
    fetchChannels();
    fetchTags();
    fetchCustomFields();
  }, [workspaceId]);

  // Update audience count when filters or channel change
  useEffect(() => {
    if (selectedChannel) {
      fetchAudienceStats();
    }
  }, [selectedChannel, audienceFilters]);

  // Auto-save draft
  const autoSave = useCallback(async () => {
    if (!broadcastName && contentBlocks[0]?.text === '') return;

    setAutoSaveStatus('Saving...');
    try {
      const method = broadcastId ? 'PATCH' : 'POST';
      const url = broadcastId
        ? `http://localhost:4000/api/broadcasts/${broadcastId}`
        : `http://localhost:4000/api/broadcasts`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: broadcastName || 'Untitled Broadcast',
          channel: selectedChannel?.type || 'messenger',
          status: 'draft',
          contentJson: JSON.stringify(contentBlocks),
          audienceFilterJson: JSON.stringify(audienceFilters),
          audienceEstimate: audienceStats.eligible,
          timezone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!broadcastId && data.broadcast?.id) {
          setBroadcastId(data.broadcast.id);
        }
        setAutoSaveStatus('Saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }
    } catch (error) {
      setAutoSaveStatus('Save failed');
    }
  }, [broadcastId, broadcastName, selectedChannel, contentBlocks, audienceFilters, audienceStats, timezone, workspaceId]);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(autoSave, 3000);
    return () => clearTimeout(timer);
  }, [broadcastName, contentBlocks, audienceFilters]);

  const fetchChannels = async () => {
    try {
      // First try the frontend brands API which has channel data
      const brandsResponse = await fetch('/api/brands');
      const brandsData = await brandsResponse.json();

      let loadedChannels = [];

      if (brandsData.brands) {
        // Find the current brand
        const currentBrand = brandsData.brands.find(b => b.id === workspaceId);
        if (currentBrand && currentBrand.channels) {
          loadedChannels = currentBrand.channels.map(ch => ({
            ...ch,
            workspaceId: workspaceId,
          }));
        }
      }

      // Fallback to backend API if no channels found
      if (loadedChannels.length === 0) {
        const response = await fetch(`http://localhost:4000/api/channels?workspaceId=${workspaceId}`);
        const data = await response.json();
        if (data.success) {
          loadedChannels = data.channels || [];
        }
      }

      setChannels(loadedChannels);

      // If channel param is in URL, pre-select it and skip to step 2
      if (channelParam) {
        const matchingChannel = loadedChannels.find(
          ch => ch.type === channelParam && ch.status === 'connected'
        );
        if (matchingChannel) {
          const channelWithConfig = {
            ...matchingChannel,
            ...channelConfigs[matchingChannel.type],
          };
          setSelectedChannel(channelWithConfig);
          setCurrentStep(2); // Skip channel selection, go to content builder
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/tags?workspaceId=${workspaceId}`);
      const data = await response.json();
      if (data.success) {
        setTags(data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/fields?workspaceId=${workspaceId}`);
      const data = await response.json();
      if (data.success) {
        setCustomFields(data.fields || []);
      }
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    }
  };

  const fetchAudienceStats = async () => {
    setLoadingAudience(true);
    try {
      const response = await fetch(`http://localhost:4000/api/broadcasts/audience-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          channel: selectedChannel?.type,
          filters: audienceFilters,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAudienceStats({
          eligible: data.eligible || 0,
          notEligible: data.notEligible || 0,
          total: data.total || 0,
          reasons: data.reasons || [],
        });
        // Update preflight check
        setPreflightChecks(prev => ({
          ...prev,
          audienceSize: (data.eligible || 0) > 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching audience stats:', error);
      // Mock data for development
      setAudienceStats({
        eligible: Math.floor(Math.random() * 500) + 100,
        notEligible: Math.floor(Math.random() * 50),
        total: Math.floor(Math.random() * 600) + 100,
        reasons: ['Outside 24h window', 'Unsubscribed', 'Invalid identifier'],
      });
    } finally {
      setLoadingAudience(false);
    }
  };

  // Content block handlers
  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      text: type === 'text' ? '' : undefined,
      url: type === 'image' || type === 'video' ? '' : undefined,
      buttons: type === 'buttons' ? [{ text: '', url: '' }] : undefined,
      quickReplies: type === 'quickReplies' ? [''] : undefined,
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateContentBlock = (id, updates) => {
    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
    // Check content validity
    checkContentValidity();
  };

  const removeContentBlock = (id) => {
    if (contentBlocks.length > 1) {
      setContentBlocks(contentBlocks.filter(block => block.id !== id));
    }
  };

  const moveContentBlock = (id, direction) => {
    const index = contentBlocks.findIndex(b => b.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentBlocks.length - 1)
    ) return;

    const newBlocks = [...contentBlocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const insertVariable = (blockId, variable) => {
    const block = contentBlocks.find(b => b.id === blockId);
    if (block && block.type === 'text') {
      updateContentBlock(blockId, { text: block.text + `{{${variable}}}` });
    }
  };

  // Check if content has unsubscribe option
  const checkContentValidity = useCallback(() => {
    const hasText = contentBlocks.some(b => b.type === 'text' && b.text?.trim());
    const config = selectedChannel ? channelConfigs[selectedChannel.type] : null;

    // Check for unsubscribe mechanism based on channel
    let hasUnsubscribe = includeUnsubscribe; // Toggle overrides manual check
    if (!hasUnsubscribe && config) {
      const allText = contentBlocks
        .filter(b => b.type === 'text')
        .map(b => b.text?.toLowerCase() || '')
        .join(' ');

      const quickReplies = contentBlocks
        .filter(b => b.type === 'quickReplies')
        .flatMap(b => b.quickReplies || [])
        .map(r => r.toLowerCase());

      if (selectedChannel?.type === 'sms') {
        hasUnsubscribe = allText.includes('stop') || allText.includes('unsubscribe');
      } else if (selectedChannel?.type === 'email') {
        hasUnsubscribe = allText.includes('unsubscribe');
      } else if (selectedChannel?.type === 'telegram') {
        hasUnsubscribe = allText.includes('/stop');
      } else {
        hasUnsubscribe = quickReplies.includes('stop') || allText.includes('stop');
      }
    }

    setPreflightChecks(prev => ({
      ...prev,
      contentValid: hasText,
      unsubscribeOption: hasUnsubscribe,
    }));
  }, [contentBlocks, selectedChannel, includeUnsubscribe]);

  useEffect(() => {
    checkContentValidity();
  }, [contentBlocks, selectedChannel, includeUnsubscribe, checkContentValidity]);

  // Handle unsubscribe toggle - add/remove "Stop" quick reply
  const handleUnsubscribeToggle = (enabled) => {
    setIncludeUnsubscribe(enabled);

    if (enabled) {
      // Check if there's already a quickReplies block with "Stop"
      const existingQRBlock = contentBlocks.find(b =>
        b.type === 'quickReplies' && b.quickReplies?.some(r => r.toLowerCase() === 'stop')
      );

      if (!existingQRBlock) {
        // Find existing quickReplies block or create new one
        const qrBlock = contentBlocks.find(b => b.type === 'quickReplies');
        if (qrBlock) {
          // Add "Stop" to existing quick replies
          updateContentBlock(qrBlock.id, {
            quickReplies: [...(qrBlock.quickReplies || []), 'Stop']
          });
        } else {
          // Create new quick replies block with "Stop"
          setContentBlocks(prev => [...prev, {
            id: `unsubscribe-${Date.now()}`,
            type: 'quickReplies',
            quickReplies: ['Stop'],
            isUnsubscribeBlock: true // Mark it so we can identify it later
          }]);
        }
      }
    } else {
      // Remove "Stop" from quick replies or remove the block if it only had "Stop"
      setContentBlocks(prev => prev.map(block => {
        if (block.type === 'quickReplies') {
          const filteredReplies = (block.quickReplies || []).filter(
            r => r.toLowerCase() !== 'stop'
          );
          // If block was auto-created for unsubscribe and now empty, mark for removal
          if (block.isUnsubscribeBlock && filteredReplies.length === 0) {
            return { ...block, _remove: true };
          }
          return { ...block, quickReplies: filteredReplies };
        }
        return block;
      }).filter(block => !block._remove));
    }
  };

  // Audience filter handlers
  const addFilter = () => {
    setAudienceFilters([...audienceFilters, {
      id: Date.now().toString(),
      field: 'tags',
      operator: 'includes',
      value: '',
    }]);
  };

  const updateFilter = (id, updates) => {
    setAudienceFilters(audienceFilters.map(f =>
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const removeFilter = (id) => {
    setAudienceFilters(audienceFilters.filter(f => f.id !== id));
  };

  // Navigation
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedChannel !== null;
      case 2:
        return contentBlocks.some(b => b.type === 'text' && b.text?.trim());
      case 3:
        return true;
      case 4:
        return preflightChecks.audienceSize && preflightChecks.contentValid;
      default:
        return false;
    }
  };

  const handleSend = async () => {
    setSaving(true);
    try {
      let scheduleAt = null;
      if (scheduleType === 'scheduled' && scheduledDate && scheduledTime) {
        scheduleAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }

      const method = broadcastId ? 'PATCH' : 'POST';
      const url = broadcastId
        ? `http://localhost:4000/api/broadcasts/${broadcastId}`
        : `http://localhost:4000/api/broadcasts`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: broadcastName || 'Untitled Broadcast',
          channel: selectedChannel.type,
          status: scheduleType === 'now' ? 'sending' : 'scheduled',
          contentJson: JSON.stringify(contentBlocks),
          audienceFilterJson: JSON.stringify(audienceFilters),
          audienceEstimate: audienceStats.eligible,
          scheduleAt,
          timezone,
        }),
      });

      if (response.ok) {
        // If sending now, trigger the send
        if (scheduleType === 'now' && broadcastId) {
          await fetch(`http://localhost:4000/api/broadcasts/${broadcastId}/send`, {
            method: 'POST',
          });
        }
        router.push(`/broadcasting?brand=${workspaceId}`);
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { id: 1, name: 'Channel', description: 'Select channel' },
    { id: 2, name: 'Content', description: 'Build message' },
    { id: 3, name: 'Audience', description: 'Target recipients' },
    { id: 4, name: 'Send', description: 'Review & send' },
  ];

  const channelConfig = selectedChannel ? channelConfigs[selectedChannel.type] : null;

  // If no brand at all, show redirect prompt
  if (!currentBrand) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <NavigationSidebar />
        <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-14 md:pt-0`}>
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Brand</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please select a brand first to create a broadcast
                </p>
                <button
                  onClick={() => router.push('/brands')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Go to Brands
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If brand exists but no channel, show channel selector prompt
  if (!currentChannel && !selectedChannel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <NavigationSidebar />
        <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-14 md:pt-0`}>
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Channel</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please select a channel for <strong>{currentBrand.name}</strong> to create a broadcast
                </p>
                <button
                  onClick={() => setShowChannelSelector(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Select Channel
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Channel Selector Modal */}
        <ChannelSelectorModal
          isOpen={showChannelSelector}
          onClose={() => setShowChannelSelector(false)}
          onSelectChannel={(channel) => {
            selectChannel(channel.id);
            setSelectedChannel({ type: channel.type, ...channel });
            setShowChannelSelector(false);
            setCurrentStep(2); // Skip to content builder
          }}
          brand={currentBrand}
          title="Select a Channel"
          message="Choose a channel to create your broadcast"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavigationSidebar />

      <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-14 md:pt-0`}>
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => router.push(`/broadcasting?brand=${workspaceId}`)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Broadcasts
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Broadcast</h1>
                {currentBrand && (currentChannel || selectedChannel) && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                    {currentBrand.name} · {currentChannel?.type || selectedChannel?.type}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {autoSaveStatus && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {autoSaveStatus}
                </span>
              )}
              <button
                onClick={autoSave}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>

          {/* Broadcast Name */}
          <div className="mb-6">
            <input
              type="text"
              value={broadcastName}
              onChange={(e) => setBroadcastName(e.target.value)}
              placeholder="Broadcast name"
              className="w-full md:w-96 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    disabled={step.id > currentStep}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.id === currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.id < currentStep ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-sm font-medium ${
                        step.id === currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            {/* STEP 1: Channel Selection */}
            {currentStep === 1 && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Choose Channel</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Select which channel to send your broadcast through</p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(channelConfigs).map(([type, config]) => {
                    const connectedChannel = channels.find(c => c.type === type && c.status === 'connected');
                    const isConnected = !!connectedChannel;

                    return (
                      <button
                        key={type}
                        onClick={() => isConnected && setSelectedChannel({ type, ...connectedChannel })}
                        disabled={!isConnected}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedChannel?.type === type
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : isConnected
                            ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{config.name}</h3>
                              {!isConnected && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
                                  Not connected
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{config.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{config.limitations}</p>
                          </div>
                          {selectedChannel?.type === type && (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {channels.filter(c => c.status === 'connected').length === 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      No channels connected. Please <a href={`/channels?brand=${workspaceId}`} className="underline font-medium">connect a channel</a> first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Content Builder */}
            {currentStep === 2 && channelConfig && (
              <div className="flex flex-col lg:flex-row">
                {/* Editor */}
                <div className="flex-1 p-6 border-r border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Build Your Message</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Add content blocks to compose your broadcast</p>

                  {/* Content Blocks */}
                  <div className="space-y-4">
                    {contentBlocks.map((block, index) => (
                      <div key={block.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Block Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {block.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveContentBlock(block.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveContentBlock(block.id, 'down')}
                              disabled={index === contentBlocks.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {contentBlocks.length > 1 && (
                              <button
                                onClick={() => removeContentBlock(block.id)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Block Content */}
                        <div className="p-4">
                          {block.type === 'text' && (
                            <div>
                              <textarea
                                value={block.text || ''}
                                onChange={(e) => updateContentBlock(block.id, { text: e.target.value })}
                                placeholder="Type your message here..."
                                rows={4}
                                maxLength={channelConfig.maxLength}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                              />
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Insert variable:</span>
                                  <div className="flex gap-1">
                                    {systemVariables.map((v) => (
                                      <button
                                        key={v.key}
                                        onClick={() => insertVariable(block.id, v.key)}
                                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                      >
                                        {`{{${v.key}}}`}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {(block.text || '').length} / {channelConfig.maxLength}
                                </span>
                              </div>
                            </div>
                          )}

                          {block.type === 'image' && (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                              <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                              <input
                                type="text"
                                value={block.url || ''}
                                onChange={(e) => updateContentBlock(block.id, { url: e.target.value })}
                                placeholder="Or paste image URL"
                                className="mt-3 w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm"
                              />
                            </div>
                          )}

                          {block.type === 'buttons' && (
                            <div className="space-y-2">
                              {(block.buttons || []).map((btn, btnIdx) => (
                                <div key={btnIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={btn.text}
                                    onChange={(e) => {
                                      const newButtons = [...(block.buttons || [])];
                                      newButtons[btnIdx].text = e.target.value;
                                      updateContentBlock(block.id, { buttons: newButtons });
                                    }}
                                    placeholder="Button text"
                                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm"
                                  />
                                  <input
                                    type="url"
                                    value={btn.url}
                                    onChange={(e) => {
                                      const newButtons = [...(block.buttons || [])];
                                      newButtons[btnIdx].url = e.target.value;
                                      updateContentBlock(block.id, { buttons: newButtons });
                                    }}
                                    placeholder="URL"
                                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm"
                                  />
                                  {(block.buttons || []).length > 1 && (
                                    <button
                                      onClick={() => {
                                        const newButtons = (block.buttons || []).filter((_, i) => i !== btnIdx);
                                        updateContentBlock(block.id, { buttons: newButtons });
                                      }}
                                      className="p-2 text-red-400 hover:text-red-600"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                              {(block.buttons || []).length < 3 && (
                                <button
                                  onClick={() => {
                                    const newButtons = [...(block.buttons || []), { text: '', url: '' }];
                                    updateContentBlock(block.id, { buttons: newButtons });
                                  }}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                                >
                                  + Add Button
                                </button>
                              )}
                            </div>
                          )}

                          {block.type === 'quickReplies' && (
                            <div className="space-y-2">
                              {(block.quickReplies || []).map((reply, replyIdx) => (
                                <div key={replyIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={reply}
                                    onChange={(e) => {
                                      const newReplies = [...(block.quickReplies || [])];
                                      newReplies[replyIdx] = e.target.value;
                                      updateContentBlock(block.id, { quickReplies: newReplies });
                                    }}
                                    placeholder="Quick reply text"
                                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm"
                                  />
                                  {(block.quickReplies || []).length > 1 && (
                                    <button
                                      onClick={() => {
                                        const newReplies = (block.quickReplies || []).filter((_, i) => i !== replyIdx);
                                        updateContentBlock(block.id, { quickReplies: newReplies });
                                      }}
                                      className="p-2 text-red-400 hover:text-red-600"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                              {(block.quickReplies || []).length < 10 && (
                                <button
                                  onClick={() => {
                                    const newReplies = [...(block.quickReplies || []), ''];
                                    updateContentBlock(block.id, { quickReplies: newReplies });
                                  }}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                                >
                                  + Add Quick Reply
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Block Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => addContentBlock('text')}
                      className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Text
                    </button>
                    {channelConfig.supportsMedia && (
                      <button
                        onClick={() => addContentBlock('image')}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Image
                      </button>
                    )}
                    {channelConfig.supportsButtons && (
                      <button
                        onClick={() => addContentBlock('buttons')}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Buttons
                      </button>
                    )}
                    {channelConfig.supportsQuickReplies && (
                      <button
                        onClick={() => addContentBlock('quickReplies')}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Quick Replies
                      </button>
                    )}
                  </div>

                  {/* Unsubscribe Toggle */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Include unsubscribe option</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Adds a "Stop" quick reply. Users who tap it will be automatically unsubscribed from future broadcasts.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnsubscribeToggle(!includeUnsubscribe)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          includeUnsubscribe ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            includeUnsubscribe ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    {includeUnsubscribe && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          "Stop" quick reply will be added automatically
                        </p>
                      </div>
                    )}
                    {!includeUnsubscribe && !preflightChecks.unsubscribeOption && (
                      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          <strong>Tip:</strong> Enable this to stay compliant and reduce blocks/reports.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="w-full lg:w-80 p-6 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Preview</h3>
                  <div className={`rounded-2xl p-4 ${
                    selectedChannel?.type === 'instagram' ? 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30' :
                    selectedChannel?.type === 'messenger' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    selectedChannel?.type === 'whatsapp' ? 'bg-green-100 dark:bg-green-900/30' :
                    selectedChannel?.type === 'telegram' ? 'bg-sky-100 dark:bg-sky-900/30' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <div className="space-y-3">
                      {contentBlocks.map((block) => (
                        <div key={block.id}>
                          {block.type === 'text' && block.text && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm overflow-hidden">
                              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                {block.text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
                                  const labels = { first_name: 'John', last_name: 'Doe', full_name: 'John Doe', email: 'john@example.com', phone: '+1234567890' };
                                  return labels[key] || `{{${key}}}`;
                                })}
                              </p>
                            </div>
                          )}
                          {block.type === 'image' && block.url && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          )}
                          {block.type === 'buttons' && (block.buttons || []).filter(b => b.text).length > 0 && (
                            <div className="space-y-2">
                              {(block.buttons || []).filter(b => b.text).map((btn, i) => (
                                <button key={i} className="w-full py-2 px-4 bg-blue-500 text-white text-sm rounded-lg">
                                  {btn.text}
                                </button>
                              ))}
                            </div>
                          )}
                          {block.type === 'quickReplies' && (block.quickReplies || []).filter(r => r).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {(block.quickReplies || []).filter(r => r).map((reply, i) => (
                                <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs rounded-full border border-blue-200 dark:border-blue-700">
                                  {reply}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Audience Targeting */}
            {currentStep === 3 && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Target Audience</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Define who should receive this broadcast</p>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Filters */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</label>
                      <button
                        onClick={addFilter}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                      >
                        + Add Filter
                      </button>
                    </div>

                    {audienceFilters.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No filters applied</p>
                        <p className="text-xs text-gray-500">All eligible contacts will receive this broadcast</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {audienceFilters.map((filter, idx) => (
                          <div key={filter.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {idx > 0 && (
                              <span className="text-xs text-gray-500 font-medium">AND</span>
                            )}
                            <select
                              value={filter.field}
                              onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                            >
                              <option value="tags">Tags</option>
                              <option value="lastActive">Last Active</option>
                              <option value="optIn">Opt-in Status</option>
                              <option value="hasChannel">Has Channel</option>
                              <option value="language">Language</option>
                            </select>

                            <select
                              value={filter.operator}
                              onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                            >
                              {filter.field === 'tags' && (
                                <>
                                  <option value="includes">includes</option>
                                  <option value="excludes">excludes</option>
                                </>
                              )}
                              {filter.field === 'lastActive' && (
                                <>
                                  <option value="within">within</option>
                                  <option value="notWithin">not within</option>
                                </>
                              )}
                              {filter.field === 'optIn' && (
                                <>
                                  <option value="equals">equals</option>
                                </>
                              )}
                              {filter.field === 'hasChannel' && (
                                <>
                                  <option value="has">has</option>
                                  <option value="notHas">does not have</option>
                                </>
                              )}
                              {filter.field === 'language' && (
                                <>
                                  <option value="equals">equals</option>
                                  <option value="notEquals">not equals</option>
                                </>
                              )}
                            </select>

                            {filter.field === 'tags' && (
                              <select
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                              >
                                <option value="">Select tag...</option>
                                {tags.map((tag) => (
                                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                              </select>
                            )}

                            {filter.field === 'lastActive' && (
                              <select
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                              >
                                <option value="1d">1 day</option>
                                <option value="7d">7 days</option>
                                <option value="30d">30 days</option>
                                <option value="90d">90 days</option>
                              </select>
                            )}

                            {filter.field === 'optIn' && (
                              <select
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                              >
                                <option value="subscribed">Subscribed</option>
                                <option value="unsubscribed">Unsubscribed</option>
                              </select>
                            )}

                            {filter.field === 'hasChannel' && (
                              <select
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                              >
                                <option value="instagram">Instagram</option>
                                <option value="messenger">Messenger</option>
                                <option value="telegram">Telegram</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">Email</option>
                              </select>
                            )}

                            {filter.field === 'language' && (
                              <input
                                type="text"
                                value={filter.value}
                                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                placeholder="e.g. en, es, fr"
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                              />
                            )}

                            <button
                              onClick={() => removeFilter(filter.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audience Stats */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-700 dark:text-green-300">Eligible recipients</span>
                        {loadingAudience && (
                          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                        {audienceStats.eligible.toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Not eligible</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {audienceStats.notEligible.toLocaleString()}
                      </p>
                      {audienceStats.reasons.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {audienceStats.reasons.map((reason, i) => (
                            <p key={i} className="text-xs text-gray-500">• {reason}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedChannel?.type === 'instagram' && (
                      <div className="p-3 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                        <p className="text-xs text-pink-800 dark:text-pink-200">
                          <strong>Instagram DM broadcast:</strong> Only contacts who have interacted within 24 hours are eligible.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Send Options & Preflight */}
            {currentStep === 4 && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Review & Send</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Choose when to send and review preflight checks</p>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Schedule Options */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">When to send</h3>

                    <div className="space-y-3">
                      <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        scheduleType === 'now' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        <input
                          type="radio"
                          name="schedule"
                          value="now"
                          checked={scheduleType === 'now'}
                          onChange={() => setScheduleType('now')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Send now</p>
                          <p className="text-sm text-gray-500">Broadcast will be sent immediately</p>
                        </div>
                      </label>

                      <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        scheduleType === 'scheduled' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        <input
                          type="radio"
                          name="schedule"
                          value="scheduled"
                          checked={scheduleType === 'scheduled'}
                          onChange={() => setScheduleType('scheduled')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Schedule for later</p>
                          <p className="text-sm text-gray-500">Pick a specific date and time</p>
                        </div>
                      </label>

                      {scheduleType === 'scheduled' && (
                        <div className="ml-8 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                            <input
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Time</label>
                            <input
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Timezone</label>
                            <select
                              value={timezone}
                              onChange={(e) => setTimezone(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
                            >
                              <option value="America/New_York">Eastern Time (ET)</option>
                              <option value="America/Chicago">Central Time (CT)</option>
                              <option value="America/Denver">Mountain Time (MT)</option>
                              <option value="America/Los_Angeles">Pacific Time (PT)</option>
                              <option value="UTC">UTC</option>
                              <option value="Europe/London">London (GMT)</option>
                              <option value="Europe/Paris">Paris (CET)</option>
                              <option value="Asia/Tokyo">Tokyo (JST)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preflight Checklist */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preflight Checklist</h3>

                    <div className="space-y-3">
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        preflightChecks.audienceSize ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                      }`}>
                        {preflightChecks.audienceSize ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <div>
                          <p className={`text-sm font-medium ${preflightChecks.audienceSize ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            Audience size
                          </p>
                          <p className={`text-xs ${preflightChecks.audienceSize ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {preflightChecks.audienceSize ? `${audienceStats.eligible.toLocaleString()} eligible recipients` : 'No eligible recipients'}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        preflightChecks.contentValid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                      }`}>
                        {preflightChecks.contentValid ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <div>
                          <p className={`text-sm font-medium ${preflightChecks.contentValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            Content valid
                          </p>
                          <p className={`text-xs ${preflightChecks.contentValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {preflightChecks.contentValid ? 'Message content is ready' : 'Add message content'}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 p-3 rounded-lg ${
                        preflightChecks.unsubscribeOption ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
                      }`}>
                        {preflightChecks.unsubscribeOption ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        <div>
                          <p className={`text-sm font-medium ${preflightChecks.unsubscribeOption ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                            Unsubscribe option
                          </p>
                          <p className={`text-xs ${preflightChecks.unsubscribeOption ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {preflightChecks.unsubscribeOption ? 'Unsubscribe option included' : 'Recommended: add unsubscribe option'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Channel</span>
                          <span className="text-gray-900 dark:text-white">{channelConfigs[selectedChannel?.type]?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Recipients</span>
                          <span className="text-gray-900 dark:text-white">{audienceStats.eligible.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Send time</span>
                          <span className="text-gray-900 dark:text-white">
                            {scheduleType === 'now' ? 'Immediately' : `${scheduledDate} ${scheduledTime}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Content blocks</span>
                          <span className="text-gray-900 dark:text-white">{contentBlocks.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!canProceed() || saving}
                className={`px-8 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed() && !saving
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? 'Processing...' : scheduleType === 'now' ? 'Send Broadcast' : 'Schedule Broadcast'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewBroadcastPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div></div>}>
        <NewBroadcastContent />
      </Suspense>
    </ProtectedRoute>
  );
}
