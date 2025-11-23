'use client'

import { useState, useEffect } from 'react'
import { useSidebar } from '../../../contexts/SidebarContext';
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import NavigationSidebar from '../../../components/NavigationSidebar'

const channelIcons = {
  instagram: '📷',
  facebook: '📘',
  whatsapp: '💬',
  telegram: '✈️',
  sms: '📱',
  tiktok: '🎵'
}

const channelColors = {
  instagram: 'from-pink-500 to-purple-600',
  facebook: 'from-blue-600 to-blue-700',
  whatsapp: 'from-green-500 to-green-600',
  telegram: 'from-blue-400 to-blue-500',
  sms: 'from-gray-500 to-gray-600',
  tiktok: 'from-black to-gray-800'
}

export default function BrandDetailsPage() {
  const { isCollapsed } = useSidebar();
  const [brand, setBrand] = useState(null)
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('channels')
  const [connectingChannel, setConnectingChannel] = useState(null)
  const [disconnectingChannel, setDisconnectingChannel] = useState(null)
  const router = useRouter()
  const params = useParams()
  const brandId = params.id

  useEffect(() => {
    if (brandId) {
      fetchBrandData()
    }
  }, [brandId])

  const fetchBrandData = async () => {
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
      console.error('Error fetching brand data:', error)
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
        setChannels(prevChannels =>
          prevChannels.map(ch =>
            ch.type === channelType ? data.channel : ch
          )
        )
      }
    } catch (error) {
      console.error('Error connecting channel:', error)
    } finally {
      setConnectingChannel(null)
    }
  }

  const handleDisconnectChannel = async (channelType) => {
    if (!confirm(`Are you sure you want to disconnect ${channelType}?`)) {
      return
    }

    setDisconnectingChannel(channelType)

    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Update channel to disconnected state
      const channelIndex = channels.findIndex(ch => ch.type === channelType)
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
    } catch (error) {
      console.error('Error disconnecting channel:', error)
    } finally {
      setDisconnectingChannel(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading brand details...</div>
      </div>
    )
  }

  const connectedCount = channels.filter(ch => ch.status === 'connected').length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavigationSidebar />
      {/* Header */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} bg-gray-900 border-b border-gray-800 px-8 py-6`}>
        <div className="max-w-7xl mx-auto">
          <Link
            href="/brands"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Brands
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{brand?.name}</h1>
              <p className="text-gray-400">
                {connectedCount} of {channels.length} channels connected
              </p>
            </div>

            <Link
              href={`/brands/${brandId}/channels`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Create Automation
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-gray-950 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'channels'
                  ? 'bg-gray-950 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Channel Settings
            </button>
            <button
              onClick={() => setActiveTab('automations')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'automations'
                  ? 'bg-gray-950 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Automations
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Brand Information</h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Brand Name:</span>
                  <span className="font-medium">{brand?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="font-medium">
                    {brand && new Date(brand.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Connected Channels:</span>
                  <span className="font-medium">{connectedCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Active Automations</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Total Messages</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Channel Settings</h2>
              <p className="text-gray-400">
                Manage your connected channels. Connect or disconnect channels to control where your automations run.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((channel) => {
                const isConnected = channel.status === 'connected'
                const isConnecting = connectingChannel === channel.type
                const isDisconnecting = disconnectingChannel === channel.type

                return (
                  <div
                    key={channel.id}
                    className={`bg-gray-900 border rounded-xl p-6 transition-all ${
                      isConnected
                        ? 'border-green-600'
                        : 'border-gray-700'
                    }`}
                  >
                    {/* Channel Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                            channelColors[channel.type]
                          } flex items-center justify-center text-2xl`}
                        >
                          {channelIcons[channel.type]}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white capitalize">
                            {channel.type}
                          </h3>
                          {isConnected && channel.accountName && (
                            <p className="text-sm text-gray-400">{channel.accountName}</p>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {isConnected ? (
                        <div className="flex items-center gap-2 bg-green-900/30 border border-green-600/50 rounded-lg px-3 py-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs text-gray-400 font-medium">Disconnected</span>
                        </div>
                      )}
                    </div>

                    {/* Connection Info */}
                    {isConnected && channel.connectedAt && (
                      <div className="mb-4 text-xs text-gray-500">
                        Connected on {new Date(channel.connectedAt).toLocaleString()}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {isConnected ? (
                        <>
                          <button
                            onClick={() => handleDisconnectChannel(channel.type)}
                            disabled={isDisconnecting}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                          </button>
                          <button
                            onClick={() => router.push(`/flows?brand=${brandId}&channel=${channel.type}`)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Create Automation
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnectChannel(channel.type)}
                          disabled={isConnecting}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          {isConnecting ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                              Connecting...
                            </span>
                          ) : (
                            'Connect Channel'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Automations Yet</h2>
            <p className="text-gray-400 mb-6">
              Create your first automation to start engaging with your audience.
            </p>
            <Link
              href={`/brands/${brandId}/channels`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Create Automation
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
