import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/api'
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage =
    product.variants[0]?.image_main ||
    product.variants[0]?.images?.[0]?.image_url ||
    PLACEHOLDER_IMAGES.product
  const price = product.min_price || product.variants[0]?.price || '0'
  const comparePrice = product.variants[0]?.compare_at_price
  const hasDiscount = comparePrice && parseFloat(comparePrice) > parseFloat(price)

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-rose-200"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            PROMO
          </div>
        )}
        {!product.is_active && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Rupture de Stock</span>
          </div>
        )}
      </div>
      <div className="p-5">
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            {product.brand}
          </p>
        )}
        <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-gray-900">
            {parseFloat(price).toFixed(2)} DA
          </p>
          {hasDiscount && comparePrice && (
            <p className="text-sm text-gray-400 line-through">
              {parseFloat(comparePrice).toFixed(2)} DA
            </p>
          )}
        </div>
        {product.min_price && product.max_price && product.min_price !== product.max_price && (
          <p className="text-sm text-gray-500 mt-1">
            De {parseFloat(product.min_price).toFixed(2)} - {parseFloat(product.max_price).toFixed(2)} DA
          </p>
        )}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-3 flex gap-2">
            {product.variants.slice(0, 3).map((variant) => (
              variant.color && (
                <div
                  key={variant.id}
                  className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: variant.color }}
                  title={variant.color}
                />
              )
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
