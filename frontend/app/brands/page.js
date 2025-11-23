'use client'

import { useState, useEffect } from 'react'
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import { useRouter } from 'next/navigation'
import NavigationSidebar from '../../components/NavigationSidebar'

const channelIcons = {
  instagram: '📷',
  facebook: '📘',
  whatsapp: '💬',
  telegram: '✈️',
  sms: '📱',
  tiktok: '🎵'
}

export default function BrandSelectionPage() {
  const { isCollapsed } = useSidebar();
  const { refreshBrands } = useBrandChannel();
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandAvatar, setNewBrandAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editBrandName, setEditBrandName] = useState('')
  const [editBrandAvatar, setEditBrandAvatar] = useState(null)
  const [editAvatarPreview, setEditAvatarPreview] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()

      if (data.success) {
        setBrands(data.brands)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBrandClick = (brandId) => {
    router.push(`/brands/${brandId}/channels`)
  }

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBrandName,
          avatar: avatarPreview // Send the base64 avatar data
        })
      })

      const data = await response.json()

      if (data.success) {
        setBrands([...brands, data.brand])
        setShowAddModal(false)
        setNewBrandName('')
        setNewBrandAvatar(null)
        setAvatarPreview(null)
      }
    } catch (error) {
      console.error('Error creating brand:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewBrandAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditBrandAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditBrand = (brand) => {
    setEditingBrand(brand)
    setEditBrandName(brand.name)
    setEditAvatarPreview(brand.avatar)
    setShowEditModal(true)
  }

  const handleUpdateBrand = async () => {
    if (!editBrandName.trim()) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/brands/${editingBrand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editBrandName,
          avatar: editAvatarPreview
        })
      })

      const data = await response.json()

      if (data.success) {
        setBrands(brands.map(b => b.id === editingBrand.id ? data.brand : b))
        // Refresh context to update the navigation menu
        await refreshBrands()
        setShowEditModal(false)
        setEditingBrand(null)
        setEditBrandName('')
        setEditBrandAvatar(null)
        setEditAvatarPreview(null)
      }
    } catch (error) {
      console.error('Error updating brand:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getConnectedChannels = (channels) => {
    return channels.filter(ch => ch.status === 'connected')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-black dark:text-white text-sm">Loading brands...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} max-w-6xl mx-auto p-8`}>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Select Your Brand</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Choose a brand to build automation for.</p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Brands */}
          {brands.map((brand) => {
            const connectedChannels = getConnectedChannels(brand.channels)

            return (
              <div
                key={brand.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg p-6 transition-all rounded-xl relative group"
              >
                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditBrand(brand)
                  }}
                  className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit Brand"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleBrandClick(brand.id)}
                  className="w-full text-left"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {brand.avatar ? (
                      <img
                        src={brand.avatar}
                        alt={brand.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{brand.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created {new Date(brand.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                {/* Connected Channels */}
                {connectedChannels.length > 0 ? (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Connected Channels:</p>
                    <div className="flex flex-wrap gap-2">
                      {connectedChannels.map((channel) => (
                        <div
                          key={channel.id}
                          className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 flex items-center gap-2"
                        >
                          <span className="text-sm">{channelIcons[channel.type]}</span>
                          <span className="text-xs text-black dark:text-white capitalize">{channel.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-500 text-xs">
                    No channels connected yet
                  </div>
                )}
              </button>
            </div>
          )
        })}

          {/* Add Brand Card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 p-6 text-center transition-all flex flex-col items-center justify-center min-h-[200px] rounded-xl"
          >
            <div className="text-3xl mb-2">+</div>
            <h3 className="text-base font-semibold text-black dark:text-white">Add New Brand</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Create a new brand account</p>
          </button>
        </div>
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Create New Brand</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddBrand()
                  }
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Avatar (Optional)
              </label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewBrandAvatar(null)
                        setAvatarPreview(null)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {newBrandName.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <span className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-block">
                      Choose Image
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddBrand}
                disabled={!newBrandName.trim() || isCreating}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2 px-4 text-sm transition-all rounded-lg shadow-sm hover:shadow-md"
              >
                {isCreating ? 'Creating...' : 'Create Brand'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewBrandName('')
                  setNewBrandAvatar(null)
                  setAvatarPreview(null)
                }}
                disabled={isCreating}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 font-medium py-2 px-4 text-sm transition-all rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditModal && editingBrand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Edit Brand</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={editBrandName}
                onChange={(e) => setEditBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Avatar
              </label>
              <div className="flex items-center gap-4">
                {editAvatarPreview ? (
                  <div className="relative">
                    <img
                      src={editAvatarPreview}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditBrandAvatar(null)
                        setEditAvatarPreview(null)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {editBrandName.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditAvatarChange}
                      className="hidden"
                    />
                    <span className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-block">
                      Choose Image
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateBrand}
                disabled={!editBrandName.trim() || isUpdating}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2 px-4 text-sm transition-all rounded-lg shadow-sm hover:shadow-md"
              >
                {isUpdating ? 'Updating...' : 'Update Brand'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingBrand(null)
                  setEditBrandName('')
                  setEditBrandAvatar(null)
                  setEditAvatarPreview(null)
                }}
                disabled={isUpdating}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 font-medium py-2 px-4 text-sm transition-all rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
