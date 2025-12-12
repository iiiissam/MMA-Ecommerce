'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api, { getAuthToken, Category } from '@/lib/api'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    is_active: true,
    categories: [] as number[],
  })

  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (hasFetched) return
    if (!getAuthToken()) {
      router.push('/admin')
      return
    }
    setHasFetched(true)
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      await api.post('/admin/products/', formData)
      router.push('/admin/products')
    } catch (err: any) {
      alert('Failed to create product: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: number) => {
    const selectedCategory = categories.find((c) => c.id === categoryId)

    if (formData.categories.includes(categoryId)) {
      // Removing category - also remove parent if it was auto-added
      const categoriesToRemove = [categoryId]
      if (selectedCategory?.parent) {
        categoriesToRemove.push(selectedCategory.parent)
      }

      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((id) => !categoriesToRemove.includes(id)),
      }))
    } else {
      // Adding category - also add parent if exists
      const categoriesToAdd = [categoryId]
      if (selectedCategory?.parent) {
        categoriesToAdd.push(selectedCategory.parent)
      }

      setFormData((prev) => ({
        ...prev,
        categories: [...new Set([...prev.categories, ...categoriesToAdd])],
      }))
    }
  }

  // Only show child categories (subcategories)
  const childCategories = categories.filter(
    (cat) => cat.parent !== null && cat.parent !== undefined
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/admin/products"
            className="text-2xl font-bold text-gray-800 hover:text-primary-600"
          >
            ← Back to Products
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Catégories</label>
            <p className="text-sm text-gray-600 mb-3">
              Sélectionnez une sous-catégorie (la catégorie parent sera automatiquement ajoutée)
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg p-4 bg-white">
              {childCategories.length > 0 ? (
                childCategories.map((category) => {
                  const parentCategory = categories.find((c) => c.id === category.parent)
                  return (
                    <label
                      key={category.id}
                      className="flex items-center text-gray-900 cursor-pointer hover:bg-rose-50 p-3 rounded-lg transition border border-transparent hover:border-rose-200"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-3 w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {parentCategory && (
                          <div className="text-xs text-gray-500">dans {parentCategory.name}</div>
                        )}
                      </div>
                    </label>
                  )
                })
              ) : (
                <p className="text-gray-500 text-center py-4">Aucune sous-catégorie disponible</p>
              )}
            </div>
            {formData.categories.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <strong>Catégories sélectionnées:</strong>{' '}
                {formData.categories
                  .map((id) => {
                    const cat = categories.find((c) => c.id === id)
                    return cat?.name
                  })
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
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

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              After creating the product, you'll be able to add variants (with prices, stock, and
              images).
            </p>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 font-medium shadow-md hover:shadow-lg transition"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <Link
                href="/admin/products"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
