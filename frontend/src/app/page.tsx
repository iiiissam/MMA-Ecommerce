import Link from 'next/link'
import Image from 'next/image'
import { getProducts, getCategories } from '@/lib/api'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  let products = []
  let categories = []

  try {
    ;[products, categories] = await Promise.all([
      getProducts({ limit: 100 }), // Get more products to randomize from
      getCategories(),
    ])
    // Shuffle and take random 4 products
    products = products.sort(() => Math.random() - 0.5).slice(0, 4)
  } catch (error) {
    console.error('Error loading homepage data:', error)
    // Continue with empty arrays if API fails
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI0ZDRTdGMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-rose-600 font-medium mb-4 tracking-widest uppercase text-sm">
              Collection Printemps 2025
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-gray-900 leading-tight">
              L'Élégance à Votre Portée
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-600 leading-relaxed">
              Découvrez notre sélection de vêtements raffinés qui allient style et confort
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections"
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Découvrir la Collection
              </Link>
              <Link
                href="/collections"
                className="border-2 border-rose-600 text-rose-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-rose-50 transition-all"
              >
                Nouveautés
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Parcourir par Catégorie
            </h2>
            <p className="text-gray-600 text-lg">Trouvez votre style parfait</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-rose-100 to-gray-100 flex items-center justify-center relative overflow-hidden">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="text-center p-6 z-10">
                      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                  <span className="text-white font-semibold text-lg">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {products.length > 0 && (
        <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Nouveautés</h2>
            <p className="text-gray-600 text-lg">Derniers ajouts à notre collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Voir Tous les Produits
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:border-rose-300 transition-all">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Livraison Gratuite</h3>
            <p className="text-gray-600">Sur les commandes de plus de 5000 DA</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:border-rose-300 transition-all">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Retours Faciles</h3>
            <p className="text-gray-600">Politique de retour de 30 jours</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:border-rose-300 transition-all">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Paiement Sécurisé</h3>
            <p className="text-gray-600">Paiement à la livraison</p>
          </div>
        </div>
      </section>
    </div>
  )
}
