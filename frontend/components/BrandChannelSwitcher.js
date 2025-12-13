"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBrandChannel } from '../contexts/BrandChannelContext';
import { ChannelIcon } from './ChannelIcon';
import ConfirmModal from './ConfirmModal';

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function BrandChannelSwitcher() {
  const router = useRouter();
  const {
    selectedBrand,
    selectedChannel,
    brands,
    selectBrand,
    selectChannel,
    refreshBrands
  } = useBrandChannel();

  const [isOpen, setIsOpen] = useState(false);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [channelToDisconnect, setChannelToDisconnect] = useState(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useIsMobile();

  // Directly compute current brand from brands array for better reactivity
  const currentBrand = brands.find(b => b.id === selectedBrand);
  const currentChannel = currentBrand?.channels?.find(c => c.id === selectedChannel);
  const channels = currentBrand?.channels || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowChannelSelector(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandSelect = (brandId) => {
    selectBrand(brandId);
    setShowChannelSelector(true);
  };

  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsOpen(false);
    setShowChannelSelector(false);
  };

  const handleDisconnectClick = (e, channel) => {
    e.stopPropagation();
    setChannelToDisconnect(channel);
    setShowDisconnectModal(true);
  };

  const handleDisconnectConfirm = async () => {
    if (!channelToDisconnect || !currentBrand) return;

    setIsDisconnecting(true);

    try {
      // Make API call to disconnect the channel
      const response = await fetch(`/api/brands/${currentBrand.id}/channels`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId: channelToDisconnect.id,
          channelType: channelToDisconnect.type,
        }),
      });

      if (response.ok) {
        // Refresh brands to get updated data
        await refreshBrands();

        // If the disconnected channel was the selected one, clear selection
        if (selectedChannel === channelToDisconnect.id) {
          selectChannel(null);
        }
      } else {
        console.error('Failed to disconnect channel');
      }
    } catch (error) {
      console.error('Error disconnecting channel:', error);
    } finally {
      setIsDisconnecting(false);
      setShowDisconnectModal(false);
      setChannelToDisconnect(null);
    }
  };

  const handleDisconnectCancel = () => {
    setShowDisconnectModal(false);
    setChannelToDisconnect(null);
  };

  if (!currentBrand) {
    return (
      <button
        onClick={() => router.push('/brands')}
        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-500 transition-all text-xs font-medium text-yellow-700 dark:text-yellow-400"
      >
        <span>⚠️ Select Brand to Continue</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Context Indicator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all"
      >
        {/* Brand Avatar with Channel Icon */}
        <div className="relative">
          {currentBrand.avatar ? (
            <img
              src={currentBrand.avatar}
              alt={currentBrand.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-900 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs border-2 border-white dark:border-gray-900 shadow-sm">
              {currentBrand.name?.charAt(0).toUpperCase()}
            </div>
          )}
          {currentChannel && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <ChannelIcon type={currentChannel.type} className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* "You are in:" Context Text */}
        <div className="hidden sm:block text-left flex-1">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            You are in:
          </div>
          <div className="text-xs font-bold text-blue-700 dark:text-blue-300 leading-tight">
            {currentBrand.name}
            {currentChannel && (
              <span className="font-normal text-gray-600 dark:text-gray-400">
                {' → '}
                <span className="capitalize font-semibold text-purple-700 dark:text-purple-300">{currentChannel.type}</span>
              </span>
            )}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {channels?.filter(c => c.status === 'connected').length || 0} channels connected
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/brands');
          }}
          className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors group"
          title="Brand Settings"
        >
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => {
            setIsOpen(false);
            setShowChannelSelector(false);
          }}
        />
      )}

      {/* Dropdown Menu - Desktop: dropdown, Mobile: bottom sheet */}
      {isOpen && (
        <div className={`
          ${isMobile
            ? 'fixed inset-x-0 bottom-0 z-[110] rounded-t-2xl max-h-[80vh] animate-slide-in-bottom safe-area-bottom'
            : 'absolute left-0 mt-2 w-64 rounded-xl'
          }
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden
        `}>
          {/* Mobile drag handle */}
          {isMobile && (
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          )}
          {!showChannelSelector ? (
            /* Brand List */
            <>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Select Brand
                </div>
                {isMobile && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 touch-target"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className={`${isMobile ? 'max-h-[50vh]' : 'max-h-64'} overflow-y-auto`}>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.id)}
                    className={`w-full px-4 py-4 md:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 transition-colors flex items-center gap-3 touch-target ${
                      brand.id === selectedBrand ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {brand.avatar ? (
                      <img
                        src={brand.avatar}
                        alt={brand.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {brand.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-black dark:text-white">
                        {brand.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {brand.channels?.filter(c => c.status === 'connected').length || 0} channels
                      </div>
                    </div>
                    {brand.id === selectedBrand && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/brands');
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  + Add New Brand
                </button>
              </div>
            </>
          ) : (
            /* Channel List for Selected Brand */
            <>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChannelSelector(false)}
                    className="text-gray-500 hover:text-black dark:hover:text-white touch-target flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Select Channel
                  </div>
                </div>
                {isMobile && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowChannelSelector(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 touch-target"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className={`${isMobile ? 'max-h-[50vh]' : 'max-h-64'} overflow-y-auto`}>
                {channels.filter(c => c.status === 'connected').map((channel) => (
                  <div
                    key={channel.id}
                    className={`w-full px-4 py-4 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 transition-colors flex items-center gap-3 ${
                      channel.id === selectedChannel ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="w-6 h-6">
                      <ChannelIcon type={channel.type} className="w-6 h-6" />
                    </div>
                    <button
                      onClick={() => handleChannelSelect(channel.id)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm font-semibold text-black dark:text-white capitalize">
                        {channel.type}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {channel.name || 'Connected'}
                      </div>
                    </button>
                    {channel.id === selectedChannel && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <button
                      onClick={(e) => handleDisconnectClick(e, channel)}
                      className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Disconnect channel"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {channels.filter(c => c.status === 'connected').length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No connected channels
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowChannelSelector(false);
                    router.push(`/brands/${selectedBrand}/channels`);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  + Connect Channel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      <ConfirmModal
        isOpen={showDisconnectModal}
        onClose={handleDisconnectCancel}
        onConfirm={handleDisconnectConfirm}
        title="Disconnect Channel"
        message={`Are you sure you want to disconnect ${channelToDisconnect?.type}? You will need to reconnect it to use it again.`}
        confirmText="Yes, Disconnect"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDisconnecting}
      />
    </div>
  );
}
