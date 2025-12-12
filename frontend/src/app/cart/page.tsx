'use client'

import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const total = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Votre Panier est Vide
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Ajoutez des articles pour commencer vos achats!
          </p>
          <Link
            href="/collections"
            className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Continuer vos Achats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Mon Panier</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variant_id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-6 hover:shadow-md transition-all"
              >
                {item.image && (
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.title || 'Produit'}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                  {item.sku && <p className="text-sm text-gray-500 mb-4">SKU: {item.sku}</p>}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-white hover:border-rose-500 hover:text-rose-600 transition-all"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-white hover:border-rose-500 hover:text-rose-600 transition-all"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      {item.price && (parseFloat(item.price) * item.quantity).toFixed(2)} DA
                    </span>
                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="text-red-600 hover:text-red-700 ml-auto font-medium hover:underline transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Récapitulatif</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-semibold">{total.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Livraison</span>
                  <span>Calculé au paiement</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-rose-600">{total.toFixed(2)} DA</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 px-6 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg mb-3"
              >
                Procéder au Paiement
              </button>
              <button
                onClick={clearCart}
                className="w-full text-gray-600 hover:text-gray-800 font-medium text-sm py-2"
              >
                Vider le Panier
              </button>
              <Link
                href="/collections"
                className="block text-center text-rose-600 hover:text-rose-700 font-medium text-sm mt-4"
              >
                ← Continuer vos Achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
