import { render, screen } from '@testing-library/react'
import ProductCard from '../ProductCard'
import { Product } from '@/lib/api'

// Mock Next.js Image component to avoid fetchPriority warning
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  brand: 'Test Brand',
  min_price: '29.99',
  max_price: '29.99',
  variants: [
    {
      id: 1,
      sku: 'TEST-001',
      price: '29.99',
      stock_quantity: 10,
      is_in_stock: true,
      is_low_stock: false,
    },
  ],
  categories: [],
  is_active: true,
}

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
  })

  it('displays price correctly', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/29.99/)).toBeInTheDocument()
  })
})
