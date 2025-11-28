'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api, { getAuthToken, Order } from '@/lib/api'
import Link from 'next/link'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (hasFetched) return
    if (!getAuthToken()) {
      router.push('/admin')
      return
    }
    setHasFetched(true)
    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/admin/orders/${orderId}/`)
      setOrder(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/update_status/`, { status: newStatus })
      fetchOrder()
    } catch (err) {
      alert('Failed to update order status')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600 text-lg">Loading...</div>
    </div>
  )
  if (!order) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-red-600 text-lg">Order not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/orders" className="text-2xl font-bold text-gray-800 hover:text-primary-600">
            ← Back to Orders
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Order {order.reference}</h1>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong className="text-gray-900">Name:</strong> {order.name}</p>
              <p><strong className="text-gray-900">Phone:</strong> {order.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong className="text-gray-900">Status:</strong> <span className="capitalize">{order.status}</span></p>
              <p><strong className="text-gray-900">Payment Status:</strong> <span className="capitalize">{order.payment_status}</span></p>
              <p><strong className="text-gray-900">Payment Method:</strong> {order.payment_method || 'N/A'}</p>
              <p><strong className="text-gray-900">Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Address</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong className="text-gray-900">Address:</strong> {order.address}</p>
            <p><strong className="text-gray-900">Wilaya:</strong> {order.wilaya_name || 'N/A'}</p>
            <p><strong className="text-gray-900">Baladiya:</strong> {order.baladiya_name || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Items</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.lines && order.lines.map((line: any) => (
                <tr key={line.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{line.sku_snapshot}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{line.title_snapshot}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parseFloat(line.price_snapshot).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{line.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{parseFloat(line.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pricing</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-900">Subtotal:</span>
              <span className="font-medium text-gray-900">{parseFloat(order.subtotal).toFixed(2)} {process.env.NEXT_PUBLIC_CURRENCY || 'EUR'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Shipping:</span>
              <span className="font-medium text-gray-900">{parseFloat(order.shipping_cost).toFixed(2)} {process.env.NEXT_PUBLIC_CURRENCY || 'EUR'}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-3 mt-3">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">{parseFloat(order.total).toFixed(2)} {process.env.NEXT_PUBLIC_CURRENCY || 'EUR'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
