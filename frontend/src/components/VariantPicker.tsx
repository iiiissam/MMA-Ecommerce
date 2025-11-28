'use client'

import { ProductVariant } from '@/lib/api'

interface VariantPickerProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelect: (variant: ProductVariant) => void
}

export default function VariantPicker({
  variants,
  selectedVariant,
  onSelect,
}: VariantPickerProps) {
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]

  const handleSizeSelect = (size: string) => {
    const variant = variants.find(
      (v) => v.size === size && v.color === selectedVariant?.color
    ) || variants.find((v) => v.size === size)
    if (variant) onSelect(variant)
  }

  const handleColorSelect = (color: string) => {
    const variant = variants.find(
      (v) => v.color === color && v.size === selectedVariant?.size
    ) || variants.find((v) => v.color === color)
    if (variant) onSelect(variant)
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Taille</label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const variant = variants.find((v) => v.size === size)
              const isSelected = selectedVariant?.size === size
              const isAvailable = variant?.is_in_stock ?? true
              
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                      : isAvailable
                      ? 'border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-gray-700'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Couleur</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const variant = variants.find((v) => v.color === color)
              const isSelected = selectedVariant?.color === color
              const isAvailable = variant?.is_in_stock ?? true
              
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={!isAvailable}
                  className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                      : isAvailable
                      ? 'border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-gray-700'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
