'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { Product, ProductVariant } from '@/lib/api'
import VariantPicker from './VariantPicker'
import QuantitySelector from './QuantitySelector'
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Set initial variant when product loads
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  // Get images from selected variant or fallback
  const images = selectedVariant?.images || []
  const mainImage =
    selectedVariant?.image_main ||
    images[selectedImage]?.image_url ||
    product.variants[0]?.image_main ||
    PLACEHOLDER_IMAGES.productLarge

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Veuillez sélectionner une variante')
      return
    }
    if (selectedVariant.stock_quantity < quantity) {
      alert(`Seulement ${selectedVariant.stock_quantity} articles disponibles en stock`)
      return
    }
    if (!selectedVariant.is_in_stock) {
      alert('Cet article est en rupture de stock')
      return
    }

    setAddingToCart(true)
    try {
      addItem({
        variant_id: selectedVariant.id,
        quantity,
        sku: selectedVariant.sku,
        title: product.title,
        price: selectedVariant.price,
        image: mainImage,
      })
      // Show success message with link to cart
      const message = document.createElement('div')
      message.className =
        'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm'
      message.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <p class="font-semibold">Ajouté au panier!</p>
            <a href="/cart" class="text-sm underline mt-1 block">Voir le Panier →</a>
          </div>
        </div>
      `
      document.body.appendChild(message)
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message)
        }
      }, 3000)
    } catch (error) {
      alert("Échec de l'ajout au panier")
    } finally {
      setAddingToCart(false)
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <Link href="/collections" className="text-rose-600 hover:text-rose-700">
          Continuer vos Achats
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-rose-600 transition-colors">
                Accueil
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/collections" className="hover:text-rose-600 transition-colors">
                Collections
              </Link>
            </li>
            {product.categories && product.categories.length > 0 && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/collections/${product.categories[0].slug}`}
                    className="hover:text-rose-600 transition-colors"
                  >
                    {product.categories[0].name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = PLACEHOLDER_IMAGES.productLarge
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-rose-600 ring-2 ring-rose-200'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                  {product.brand}
                </p>
              )}
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{product.title}</h1>
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/collections/${cat.slug}`}
                      className="text-sm text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1 rounded-full"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  {parseFloat(selectedVariant.price).toFixed(2)} DA
                </span>
                {selectedVariant.compare_at_price &&
                  parseFloat(selectedVariant.compare_at_price) >
                    parseFloat(selectedVariant.price) && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {parseFloat(selectedVariant.compare_at_price).toFixed(2)} DA
                      </span>
                      <span className="bg-rose-100 text-rose-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Promo
                      </span>
                    </>
                  )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 ? (
              <>
                <VariantPicker
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelect={setSelectedVariant}
                />

                <QuantitySelector
                  quantity={quantity}
                  max={selectedVariant?.stock_quantity || 0}
                  onChange={setQuantity}
                />

                {/* Stock Info */}
                {selectedVariant && (
                  <div className="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2">
                      {selectedVariant.is_in_stock ? (
                        <>
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          <p className="text-sm font-semibold text-gray-900">
                            <span className="text-rose-600">{selectedVariant.stock_quantity}</span>{' '}
                            en stock
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          <p className="text-sm text-red-600 font-semibold">Rupture de stock</p>
                        </>
                      )}
                    </div>
                    {selectedVariant.is_low_stock && selectedVariant.is_in_stock && (
                      <p className="text-sm text-orange-700 font-semibold bg-orange-50 px-3 py-2 rounded">
                        ⚠️ Stock limité - Commandez vite!
                      </p>
                    )}
                    {selectedVariant.sku && (
                      <p className="text-xs text-gray-600 font-medium">
                        Réf: <span className="font-mono">{selectedVariant.sku}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || !selectedVariant.is_in_stock || addingToCart}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 px-6 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none"
                  >
                    {addingToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Ajout en cours...
                      </span>
                    ) : selectedVariant?.is_in_stock ? (
                      'Ajouter au Panier'
                    ) : (
                      'Rupture de Stock'
                    )}
                  </button>
                  {selectedVariant?.is_in_stock && (
                    <button
                      onClick={() => {
                        if (!selectedVariant) {
                          alert('Veuillez sélectionner une variante')
                          return
                        }
                        if (selectedVariant.stock_quantity < quantity) {
                          alert(
                            `Seulement ${selectedVariant.stock_quantity} articles disponibles en stock`
                          )
                          return
                        }

                        // Add to cart and redirect to checkout
                        addItem({
                          variant_id: selectedVariant.id,
                          quantity,
                          sku: selectedVariant.sku,
                          title: product.title,
                          price: selectedVariant.price,
                          image: mainImage,
                        })
                        // Redirect directly to checkout
                        window.location.href = '/checkout'
                      }}
                      disabled={!selectedVariant || !selectedVariant.is_in_stock}
                      className="w-full bg-white border-2 border-rose-600 text-rose-600 py-4 px-6 rounded-full font-semibold text-lg hover:bg-rose-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                    >
                      Acheter Maintenant
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">Aucune variante disponible pour ce produit.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
