import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api'
import ProductDetail from '@/components/ProductDetail'
import Link from 'next/link'

export const revalidate = 60

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await getProduct(params.slug)

    // Check if product exists and is active
    if (!product || !product.is_active) {
      notFound()
    }

    return <ProductDetail product={product} />
  } catch (error: any) {
    console.error('Error loading product:', error)
    notFound()
  }
}
