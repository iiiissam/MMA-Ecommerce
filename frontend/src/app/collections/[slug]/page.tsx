import { notFound } from 'next/navigation'
import { getCategory, getProducts } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import FiltersPanel from '@/components/FiltersPanel'
import Link from 'next/link'

export const revalidate = 60

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    const category = await getCategory(params.slug)
    const products = await getProducts({
      category: params.slug,
      ...searchParams,
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Category Header */}
          <div className="mb-12">
            <Link
              href="/collections"
              className="text-rose-600 hover:text-rose-700 font-medium mb-4 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux Collections
            </Link>
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 text-lg max-w-3xl">{category.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Filtres
                </h2>
                <FiltersPanel />
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {products.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                      Affichage de <span className="font-semibold text-gray-900">{products.length}</span> produits dans {category.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
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
                    Aucun produit disponible dans cette catégorie pour le moment.
                  </p>
                  <Link
                    href="/collections"
                    className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg"
                  >
                    Parcourir Toutes les Collections
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
