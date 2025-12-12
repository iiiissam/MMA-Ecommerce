'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api, { getAuthToken, Category } from '@/lib/api'
import Link from 'next/link'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) return
    try {
      await api.delete(`/admin/categories/${slug}/`)
      fetchCategories()
    } catch (err) {
      alert('Échec de la suppression de la catégorie')
    }
  }

  if (loading)
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
            href="/admin/dashboard"
            className="text-2xl font-bold text-gray-800 hover:text-primary-600"
          >
            ← Admin Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded hover:bg-red-50 transition"
          >
            Logout
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <Link
            href="/admin/categories/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg font-medium"
          >
            + Add New Category
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No categories found.{' '}
                    <Link
                      href="/admin/categories/new"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Create your first category
                    </Link>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          category.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/categories/${category.slug}`}
                        className="text-primary-600 hover:text-primary-800 mr-4 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category.slug)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
