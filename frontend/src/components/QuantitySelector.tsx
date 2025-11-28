'use client'

interface QuantitySelectorProps {
  quantity: number
  max: number
  onChange: (quantity: number) => void
}

export default function QuantitySelector({
  quantity,
  max,
  onChange,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) onChange(quantity - 1)
  }

  const handleIncrease = () => {
    if (quantity < max) onChange(quantity + 1)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">Quantité</label>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-rose-400 transition-colors font-semibold text-lg text-black"
          aria-label="Diminuer la quantité"
        >
          −
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 1
            onChange(Math.min(Math.max(1, val), max))
          }}
          min={1}
          max={max}
          className="w-20 text-center border-2 border-gray-300 rounded-lg py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-black"
        />
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-rose-400 transition-colors font-semibold text-lg text-black"
          aria-label="Augmenter la quantité"
        >
          +
        </button>
        {max > 0 && (
          <span className="text-sm text-gray-500 ml-2">Max: {max}</span>
        )}
      </div>
    </div>
  )
}
