import axios from 'axios'

// Get API URL based on context (server vs client)
// Server-side (SSR in Docker): use service name 'backend'
// Client-side (browser): use 'localhost'
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering - use Docker service name
    return 'http://backend:8000/api/v1'
  }
  // Client-side - browser will connect to localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
}

export interface ProductVariant {
  id: number
  sku: string
  size?: string
  color?: string
  price: string
  compare_at_price?: string
  stock_quantity: number
  is_in_stock: boolean
  is_low_stock: boolean
  image_main?: string
  images?: ProductImage[]
}

export interface ProductImage {
  id: number
  image_url: string
  alt_text?: string
  position: number
}

export interface Product {
  id: number
  title: string
  slug: string
  description: string
  brand?: string
  min_price?: string
  max_price?: string
  variants: ProductVariant[]
  categories: Array<{ id: number; name: string; slug: string }>
  is_active: boolean
}

export interface CartItem {
  variant_id: number
  quantity: number
}

export interface Order {
  id: number
  reference: string
  status: string
  name: string
  phone: string
  address: string
  wilaya: number
  wilaya_name?: string
  baladiya: number
  baladiya_name?: string
  subtotal: string
  shipping_cost: string
  total: string
  payment_method: string
  payment_status: string
  lines?: Array<{
    id: number
    sku_snapshot: string
    title_snapshot: string
    price_snapshot: string
    quantity: number
    line_total: string
  }>
  created_at: string
}

// API functions
export async function getCategories(parent?: string | null): Promise<Category[]> {
  try {
    const params: any = {}
    if (parent !== undefined) {
      params.parent = parent || 'null'
    }
    const response = await api.get('/categories/', { params })
    // Handle both paginated and non-paginated responses
    return response.data.results || response.data || []
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategory(slug: string): Promise<Category> {
  const response = await api.get(`/categories/${slug}/`)
  return response.data
}

export async function getProducts(params?: {
  category?: string
  search?: string
  price_min?: string
  price_max?: string
  size?: string
  color?: string
  limit?: number
  page?: number
}): Promise<Product[]> {
  try {
    const response = await api.get('/products/', { params })
    return response.data.results || response.data
  } catch (error: any) {
    console.error('Error fetching products:', error)
    // Return empty array on error instead of crashing
    return []
  }
}

export async function getProduct(slug: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${slug}/`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await api.get('/search/', { params: { q: query } })
  return response.data.results || []
}

export async function validateCart(items: CartItem[]): Promise<any> {
  const response = await api.post('/cart/validate/', { items })
  return response.data
}

export async function checkout(data: {
  items: CartItem[]
  name: string
  phone: string
  address: string
  wilaya: number
  baladiya: number
}): Promise<Order> {
  const response = await api.post('/checkout/', data)
  return response.data
}

export async function getWilayas(): Promise<Array<{ id: number; name: string }>> {
  const response = await api.get('/wilayas/')
  return response.data.results || response.data
}

export async function getBaladiyas(
  wilayaId: number
): Promise<Array<{ id: number; name: string; wilaya: number }>> {
  const response = await api.get(`/baladiyas/?wilaya=${wilayaId}`)
  return response.data.results || response.data
}

export async function getOrderByReference(reference: string, email: string): Promise<Order> {
  const response = await api.get(`/orders/${reference}/`, {
    params: { email },
  })
  return response.data
}

// Admin API functions
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_token', token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('admin_token')
}

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export default api
