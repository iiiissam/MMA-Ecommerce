'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api, { getAuthToken, Category } from '@/lib/api'
import Link from 'next/link'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    image_url: '',
    is_active: true,
  })

  useEffect(() => {
    if (hasFetched) return
    if (!getAuthToken()) {
      router.push('/admin')
      return
    }
    setHasFetched(true)
    fetchCategory()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchCategory = async () => {
    try {
      const response = await api.get(`/admin/categories/${slug}/`)
      const catData = response.data
      setCategory(catData)
      setFormData({
        name: catData.name,
        description: catData.description || '',
        parent: catData.parent ? catData.parent.toString() : '',
        image_url: catData.image_url || '',
        is_active: catData.is_active,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories/')
      setCategories(response.data.results || response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data: any = {
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        is_active: formData.is_active,
      }
      if (formData.parent) {
        data.parent = parseInt(formData.parent)
      }
      await api.put(`/admin/categories/${slug}/`, data)
      router.push('/admin/categories')
    } catch (err: any) {
      alert('Failed to update category: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (!category)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/admin/categories"
            className="text-2xl font-bold text-gray-800 hover:text-primary-600"
          >
            ← Back to Categories
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Category</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Parent Category</label>
            <select
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">None (Top Level)</option>
              {categories
                .filter((cat) => cat.id !== category.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 font-medium shadow-md hover:shadow-lg transition"
            >
              {loading ? 'Updating...' : 'Update Category'}
            </button>
            <Link
              href="/admin/categories"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
