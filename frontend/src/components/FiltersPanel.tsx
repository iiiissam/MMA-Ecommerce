'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function FiltersPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '')

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (priceMin) params.set('price_min', priceMin)
    else params.delete('price_min')
    if (priceMax) params.set('price_max', priceMax)
    else params.delete('price_max')
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Gamme de Prix</h3>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Min (DA)"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
        <input
          type="number"
          placeholder="Max (DA)"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
        <button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 px-4 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all font-medium shadow-sm"
        >
          Appliquer les Filtres
        </button>
      </div>
    </div>
  )
}
