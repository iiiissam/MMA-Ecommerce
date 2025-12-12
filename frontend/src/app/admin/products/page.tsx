'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api, { getAuthToken, Product } from '@/lib/api'
import Link from 'next/link'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasFetched, setHasFetched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const itemsPerPage = 20

  useEffect(() => {
    if (hasFetched) return
    if (!getAuthToken()) {
      router.push('/admin')
      return
    }
    setHasFetched(true)
    fetchProducts(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/products/?page=${page}`)
      const data = response.data.results || response.data
      setProducts(data)
      setTotalProducts(response.data.count || 0)
      setHasNext(!!response.data.next)
      setHasPrev(!!response.data.previous)
      setCurrentPage(page)
    } catch (err: any) {
      setError('Échec du chargement des produits')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  const handleDelete = async (slug: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return

    try {
      await api.delete(`/admin/products/${slug}/`)
      fetchProducts(currentPage)
    } catch (err: any) {
      alert('Échec de la suppression du produit')
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
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
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <Link
            href="/admin/products/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg font-medium"
          >
            + Add New Product
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Brand
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No products found.{' '}
                    <Link
                      href="/admin/products/new"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Create your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.brand || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 mr-4 font-medium"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/products/${product.slug}/variants`}
                        className="text-purple-600 hover:text-purple-800 mr-4 font-medium"
                      >
                        Variants
                      </Link>
                      <button
                        onClick={() => handleDelete(product.slug)}
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

        {/* Pagination */}
        {totalProducts > itemsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={!hasPrev}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              ← Précédent
            </button>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md min-w-[100px] text-center">
                Page {currentPage}
              </span>
              <span className="text-sm text-gray-600">
                sur {totalPages} ({totalProducts} produits)
              </span>
            </div>

            <button
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={!hasNext}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
