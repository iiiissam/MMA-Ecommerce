import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  variant_id: number
  quantity: number
  sku?: string
  title?: string
  price?: string
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.variant_id === item.variant_id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.variant_id === item.variant_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variant_id !== variantId) })
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
        } else {
          set({
            items: get().items.map((i) =>
              i.variant_id === variantId ? { ...i, quantity } : i
            ),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + (parseFloat(item.price || '0') * item.quantity),
          0
        )
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined)),
    }
  )
)

