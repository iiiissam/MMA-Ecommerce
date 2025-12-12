'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProducts, getCategories, Category as CategoryType } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import FiltersPanel from '@/components/FiltersPanel'
import Link from 'next/link'

interface CategoryTreeProps {
  category: CategoryType
  children: CategoryType[]
  level?: number
}

function CategoryTree({ category, children, level = 0 }: CategoryTreeProps) {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = children.length > 0

  return (
    <div className={level > 0 ? 'ml-4' : ''}>
      <div className="flex items-center gap-2">
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-rose-600 transition-colors p-1"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <Link
          href={`/collections/${category.slug}`}
          className={`flex-1 block text-gray-700 hover:text-rose-600 font-medium transition-colors py-2 px-3 rounded-lg hover:bg-rose-50 ${
            level === 0 ? 'font-semibold text-base' : 'text-sm'
          } ${!hasChildren ? 'ml-6' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {level === 0 && (
                <svg
                  className="w-5 h-5 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              )}
              <span>{category.name}</span>
            </div>
            {category.product_count !== undefined && category.product_count > 0 && (
              <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">
                {category.product_count}
              </span>
            )}
          </div>
        </Link>
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {children.map((child) => (
            <CategoryTree key={child.id} category={child} children={[]} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CollectionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    setCurrentPage(page)
    fetchData(page)
  }, [searchParams])

  const fetchData = async (page: number) => {
    try {
      setLoading(true)
      const params: any = { page: page }
      searchParams.forEach((value, key) => {
        if (key !== 'page') {
          params[key] = value
        }
      })

      const categoriesData = await getCategories()
      setCategories(categoriesData)

      // Use the API client directly to get full response
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/products/?${new URLSearchParams(params).toString()}`
      )
      const data = await response.json()

      setProducts(data.results || data)
      setTotalCount(data.count || 0)
      setHasNext(!!data.next)
      setHasPrev(!!data.previous)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/collections?${params.toString()}`)
  }

  // Build category tree
  const parentCategories = categories.filter((cat) => !cat.parent)
  const getCategoryChildren = (parentId: number) => {
    return categories.filter((cat) => cat.parent === parentId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            Toutes les Collections
          </h1>
          <p className="text-gray-600 text-lg">Découvrez notre gamme complète de mode</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Tree View */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-200">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Catégories
                </h2>

                {/* All Products Link */}
                <Link
                  href="/collections"
                  className="flex items-center gap-2 text-gray-700 hover:text-rose-600 font-semibold transition-colors py-3 px-3 rounded-lg hover:bg-rose-50 mb-4 border-b border-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Tous les Produits
                </Link>

                {/* Category Tree */}
                <div className="space-y-2">
                  {parentCategories.map((category) => (
                    <CategoryTree
                      key={category.id}
                      category={category}
                      children={getCategoryChildren(category.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <FiltersPanel />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Affichage de{' '}
                    <span className="font-semibold text-gray-900">{products.length}</span> produits
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalCount > itemsPerPage && (
                  <div className="flex justify-center items-center gap-3 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrev}
                      className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                    >
                      ← Précédent
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg shadow-md min-w-[100px] text-center">
                        Page {currentPage}
                      </span>
                      <span className="text-sm text-gray-600">
                        sur {totalPages} ({totalCount} produits)
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext}
                      className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Essayez d'ajuster vos filtres ou parcourez nos catégories
                </p>
                <Link
                  href="/collections"
                  className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg"
                >
                  Voir Tous les Produits
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
