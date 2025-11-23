'use client'

import { useState, useEffect } from 'react'
import { useSidebar } from '../../../../contexts/SidebarContext';
import { useBrandChannel } from '../../../../contexts/BrandChannelContext';
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import NavigationSidebar from '../../../../components/NavigationSidebar'
import { ChannelIcon } from '../../../../components/ChannelIcon'
import ConfirmModal from '../../../../components/ConfirmModal'

// URLs for managing channel connections
const channelManagementUrls = {
  facebook: 'https://business.facebook.com/settings/pages',
  instagram: 'https://www.facebook.com/settings?tab=business_tools',
  whatsapp: 'https://business.facebook.com/wa/manage/home/',
  telegram: 'https://core.telegram.org/bots',
  sms: null, // SMS doesn't have a specific management URL
  tiktok: 'https://www.tiktok.com/business/settings'
}

export default function ChannelSelectionPage() {
  const { isCollapsed } = useSidebar();
  const { refreshBrands } = useBrandChannel();
  const [brand, setBrand] = useState(null)
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [connectingChannel, setConnectingChannel] = useState(null)
  const [disconnectingChannel, setDisconnectingChannel] = useState(null)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [channelToDisconnect, setChannelToDisconnect] = useState(null)
  const router = useRouter()
  const params = useParams()
  const brandId = params.id

  useEffect(() => {
    if (brandId) {
      fetchChannels()
    }
  }, [brandId])

  const fetchChannels = async () => {
    try {
      const response = await fetch(`/api/brands/${brandId}/channels`)
      const data = await response.json()

      if (data.success) {
        setBrand(data.brand)
        setChannels(data.channels)
      } else {
        router.push('/brands')
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
      router.push('/brands')
    } finally {
      setLoading(false)
    }
  }

  const handleConnectChannel = async (channelType) => {
    setConnectingChannel(channelType)

    // Simulate OAuth/connection flow
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const response = await fetch(`/api/brands/${brandId}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelType,
          accountName: `${channelType}_demo_account`
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update the channel in state
        setChannels(prevChannels =>
          prevChannels.map(ch =>
            ch.type === channelType ? data.channel : ch
          )
        )
        // Refresh context to update all channel selectors
        await refreshBrands()
      }
    } catch (error) {
      console.error('Error connecting channel:', error)
    } finally {
      setConnectingChannel(null)
    }
  }

  const handleDisconnectClick = (channelType) => {
    setChannelToDisconnect(channelType)
    setShowDisconnectModal(true)
  }

  const handleDisconnectConfirm = async () => {
    if (!channelToDisconnect) return

    setDisconnectingChannel(channelToDisconnect)

    try {
      // Make API call to disconnect the channel
      const response = await fetch(`/api/brands/${brandId}/channels`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelType: channelToDisconnect,
        }),
      })

      if (response.ok) {
        // Update local state
        const channelIndex = channels.findIndex(ch => ch.type === channelToDisconnect)
        if (channelIndex !== -1) {
          const updatedChannels = [...channels]
          updatedChannels[channelIndex] = {
            ...updatedChannels[channelIndex],
            status: 'disconnected',
            accountName: null,
            connectedAt: null
          }
          setChannels(updatedChannels)
        }
        // Refresh context to update all channel selectors
        await refreshBrands()
      } else {
        console.error('Failed to disconnect channel')
      }
    } catch (error) {
      console.error('Error disconnecting channel:', error)
    } finally {
      setDisconnectingChannel(null)
      setShowDisconnectModal(false)
      setChannelToDisconnect(null)
    }
  }

  const handleDisconnectCancel = () => {
    setShowDisconnectModal(false)
    setChannelToDisconnect(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading channels...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavigationSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} max-w-6xl mx-auto p-8`}>
        {/* Header with Back Button */}
        <div className="mb-12">
          <Link
            href="/brands"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Brands
          </Link>

          <h1 className="text-4xl font-bold text-white mb-3">
            Manage Channels
          </h1>
          <p className="text-gray-400 text-lg">
            Connect and manage channels for <span className="text-white font-semibold">{brand?.name}</span>.
          </p>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => {
            const isConnected = channel.status === 'connected'
            const isConnecting = connectingChannel === channel.type
            const isDisconnecting = disconnectingChannel === channel.type

            return (
              <div
                key={channel.id}
                className={`bg-gray-900 border rounded-xl p-6 transition-all duration-200 ${
                  isConnected
                    ? 'border-green-600'
                    : 'border-gray-700'
                }`}
              >
                {/* Channel Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-800"
                  >
                    <ChannelIcon type={channel.type} className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white capitalize">
                      {channel.type}
                    </h3>
                    {isConnected && channel.accountName && (
                      <p className="text-sm text-gray-400">{channel.accountName}</p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {isConnected ? (
                    <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-600/50 rounded-lg px-3 py-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-400 font-medium">Not Connected</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {isConnected ? (
                  <div className="space-y-2">
                    {/* Manage Connection Button */}
                    {channelManagementUrls[channel.type] && (
                      <button
                        onClick={() => window.open(channelManagementUrls[channel.type], '_blank')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manage Connection
                      </button>
                    )}
                    {/* Disconnect Button */}
                    <button
                      onClick={() => handleDisconnectClick(channel.type)}
                      disabled={isDisconnecting}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {isDisconnecting && disconnectingChannel === channel.type ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                          Disconnecting...
                        </span>
                      ) : (
                        'Disconnect'
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnectChannel(channel.type)}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {isConnecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Connecting...
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}

                {isConnected && channel.connectedAt && (
                  <div className="mt-3 text-xs text-gray-500">
                    Connected {new Date(channel.connectedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-900/20 border border-blue-600/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Manage Your Channels</h3>
              <p className="text-gray-400 text-sm">
                Connect or disconnect your social media channels. You can manage multiple channels for each brand.
                To build automations, use the Flow Builder from the navigation menu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      <ConfirmModal
        isOpen={showDisconnectModal}
        onClose={handleDisconnectCancel}
        onConfirm={handleDisconnectConfirm}
        title="Disconnect Channel"
        message={`Are you sure you want to disconnect ${channelToDisconnect}? You will need to reconnect it to use it again.`}
        confirmText="Yes, Disconnect"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={disconnectingChannel === channelToDisconnect}
      />
    </div>
  )
}
