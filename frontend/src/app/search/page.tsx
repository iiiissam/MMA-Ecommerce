'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProducts } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const itemsPerPage = 20

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    setCurrentPage(page)
    if (searchQuery) {
      fetchProducts(page)
    } else {
      setLoading(false)
    }
  }, [searchQuery, searchParams])

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/products/?search=${searchQuery}&page=${page}`
      )
      const data = await response.json()
      setProducts(data.results || data)
      setTotalCount(data.count || 0)
      setHasNext(!!data.next)
      setHasPrev(!!data.previous)
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/search?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Recherche en cours...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium mb-4 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour à l'accueil
          </Link>

          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Résultats de recherche
          </h1>

          {searchQuery ? (
            <p className="text-xl text-gray-600">
              Recherche pour: <span className="font-semibold text-gray-900">"{searchQuery}"</span>
            </p>
          ) : (
            <p className="text-xl text-gray-600">Aucune recherche effectuée</p>
          )}
        </div>

        {/* Search Box */}
        <div className="mb-12 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const query = formData.get('q') as string
              if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`)
              }
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Rechercher des produits..."
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Results */}
        {!searchQuery ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Commencez votre recherche</h3>
            <p className="text-gray-600 mb-6">
              Entrez un terme de recherche pour trouver des produits
            </p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{products.length}</span> produit(s)
                trouvé(s)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
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
                    sur {totalPages} ({totalCount} résultats)
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-6">
              Aucun produit ne correspond à votre recherche "{searchQuery}"
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/collections"
                className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg"
              >
                Parcourir les Collections
              </Link>
              <button
                onClick={() => router.push('/search')}
                className="inline-block border-2 border-rose-600 text-rose-600 px-6 py-3 rounded-full font-semibold hover:bg-rose-50 transition-all"
              >
                Nouvelle Recherche
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
