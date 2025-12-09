'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Predefined colors for tags and categories
const TAG_COLORS = [
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
]

export default function TagSelector({ workspaceId, selectedTags = [], onSelectTags, multiple = true }) {
  const [tags, setTags] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagCategoryId, setNewTagCategoryId] = useState('')
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState(TAG_COLORS[0])
  const [searchQuery, setSearchQuery] = useState('')

  // Normalize selectedTags to always be an array
  const normalizedSelectedTags = Array.isArray(selectedTags) ? selectedTags : (selectedTags ? [selectedTags] : [])

  // Fetch tags and categories
  useEffect(() => {
    const fetchData = async () => {
      console.log('TagSelector: workspaceId =', workspaceId)
      if (!workspaceId) {
        console.log('TagSelector: No workspaceId, stopping loading')
        setLoading(false)
        return
      }

      try {
        const [tagsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/tags/${workspaceId}`),
          fetch(`${API_URL}/api/tags/categories/${workspaceId}`),
        ])

        const tagsData = await tagsRes.json()
        const categoriesData = await categoriesRes.json()

        if (tagsData.success) {
          setTags(tagsData.tags)
        }
        if (categoriesData.success) {
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [workspaceId])

  // Handle tag selection/deselection
  const handleTagClick = (tag) => {
    if (multiple) {
      const isSelected = normalizedSelectedTags.some(t => t.id === tag.id)
      if (isSelected) {
        // Remove tag
        onSelectTags(normalizedSelectedTags.filter(t => t.id !== tag.id))
      } else {
        // Add tag
        onSelectTags([...normalizedSelectedTags, tag])
      }
    } else {
      // Single selection mode
      onSelectTags([tag])
    }
  }

  // Remove a specific tag
  const handleRemoveTag = (tagId) => {
    onSelectTags(normalizedSelectedTags.filter(t => t.id !== tagId))
  }

  // Create new tag
  const handleCreateTag = async () => {
    if (!newTagName.trim() || !workspaceId) return

    try {
      const response = await fetch(`${API_URL}/api/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: newTagName.trim(),
          categoryId: newTagCategoryId || null,
          color: newTagColor,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTags([...tags, data.tag])
        setNewTagName('')
        setNewTagCategoryId('')
        setShowCreateTag(false)
        // Auto-select the new tag
        if (multiple) {
          onSelectTags([...normalizedSelectedTags, data.tag])
        } else {
          onSelectTags([data.tag])
        }
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !workspaceId) return

    try {
      const response = await fetch(`${API_URL}/api/tags/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: newCategoryName.trim(),
          color: newCategoryColor,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCategories([...categories, data.category])
        setNewCategoryName('')
        setShowCreateCategory(false)
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  // Filter tags by search query
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group tags by category
  const groupedTags = filteredTags.reduce((acc, tag) => {
    const categoryName = tag.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(tag)
    return acc
  }, {})

  // Check if a tag is selected
  const isTagSelected = (tagId) => normalizedSelectedTags.some(t => t.id === tagId)

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 mt-2">Loading tags...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Selected Tags Display */}
      {normalizedSelectedTags.length > 0 && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-2">
            Selected Tags ({normalizedSelectedTags.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {normalizedSelectedTags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></span>
                {tag.name}
                {tag.category && (
                  <span className="opacity-70">({tag.category.name})</span>
                )}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 hover:opacity-70"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags..."
          className="w-full p-2 pl-8 text-sm border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>

      {/* Tags List */}
      <div className="max-h-48 overflow-y-auto space-y-3">
        {Object.keys(groupedTags).length > 0 ? (
          Object.entries(groupedTags).map(([categoryName, categoryTags]) => (
            <div key={categoryName}>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                {categoryName}
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isTagSelected(tag.id)
                        ? 'ring-2 ring-purple-500 ring-offset-1'
                        : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                    }`}
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      borderColor: tag.color,
                      border: `1px solid ${tag.color}40`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    ></span>
                    {tag.name}
                    {isTagSelected(tag.id) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No tags found</p>
            <p className="text-xs">Create your first tag below</p>
          </div>
        )}
      </div>

      {/* Create New Tag */}
      {showCreateTag ? (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Create New Tag</span>
            <button
              onClick={() => setShowCreateTag(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="text-sm">x</span>
            </button>
          </div>

          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          <select
            value={newTagCategoryId}
            onChange={(e) => setNewTagCategoryId(e.target.value)}
            className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Color:</span>
            <div className="flex gap-1">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-6 h-6 rounded-full ${newTagColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
              className="flex-1 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Create Tag
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateTag(true)}
          className="w-full py-2 text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          + Create New Tag
        </button>
      )}

      {/* Create New Category */}
      {showCreateCategory ? (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Create New Category</span>
            <button
              onClick={() => setShowCreateCategory(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="text-sm">x</span>
            </button>
          </div>

          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name (e.g., Lead Status, Interests)"
            className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Color:</span>
            <div className="flex gap-1">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-6 h-6 rounded-full ${newCategoryColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
            className="w-full py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            Create Category
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateCategory(true)}
          className="w-full py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          + Add Category to organize tags
        </button>
      )}
    </div>
  )
}
