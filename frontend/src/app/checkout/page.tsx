'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { checkout, getWilayas, getBaladiyas } from '@/lib/api'
import Link from 'next/link'

interface CheckoutFormData {
  name: string
  phone: string
  address: string
  wilaya: string
  baladiya: string
}

interface Wilaya {
  id: number
  name: string
}

interface Baladiya {
  id: number
  name: string
  wilaya: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getTotalPrice } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [baladiyas, setBaladiyas] = useState<Baladiya[]>([])
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    address: '',
    wilaya: '',
    baladiya: '',
  })

  useEffect(() => {
    fetchWilayas()
  }, [])

  useEffect(() => {
    if (formData.wilaya) {
      fetchBaladiyas(parseInt(formData.wilaya))
    } else {
      setBaladiyas([])
      setFormData(prev => ({ ...prev, baladiya: '' }))
    }
  }, [formData.wilaya])

  const fetchWilayas = async () => {
    try {
      const response = await getWilayas()
      setWilayas(response)
    } catch (err) {
      console.error('Failed to load wilayas:', err)
    }
  }

  const fetchBaladiyas = async (wilayaId: number) => {
    try {
      const response = await getBaladiyas(wilayaId)
      setBaladiyas(response)
    } catch (err) {
      console.error('Failed to load baladiyas:', err)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const order = await checkout({
        items: items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        wilaya: parseInt(formData.wilaya),
        baladiya: parseInt(formData.baladiya),
      })

      clearCart()
      router.push(`/order-success?reference=${order.reference}`)
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'La commande a échoué. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const total = getTotalPrice()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Finaliser la Commande</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
              {/* Customer Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Informations Client</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                      placeholder="05XX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Adresse de Livraison</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresse Complète *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                      placeholder="Rue, bâtiment, numéro d'appartement..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Wilaya *
                      </label>
                      <select
                        required
                        value={formData.wilaya}
                        onChange={(e) => setFormData({ ...formData, wilaya: e.target.value, baladiya: '' })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                      >
                        <option value="">Sélectionnez une Wilaya</option>
                        {wilayas.map((wilaya) => (
                          <option key={wilaya.id} value={wilaya.id}>
                            {wilaya.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Commune *
                      </label>
                      <select
                        required
                        value={formData.baladiya}
                        onChange={(e) => setFormData({ ...formData, baladiya: e.target.value })}
                        disabled={!formData.wilaya}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Sélectionnez une Commune</option>
                        {baladiyas.map((baladiya) => (
                          <option key={baladiya.id} value={baladiya.id}>
                            {baladiya.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Paiement</h2>
                <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-lg font-bold text-gray-900">Paiement à la Livraison</p>
                      <p className="text-sm text-gray-600">Payez en espèces lors de la réception de votre commande</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 px-6 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Traitement en cours...
                  </span>
                ) : (
                  'Confirmer la Commande'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Récapitulatif de Commande</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.variant_id} className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.price && (parseFloat(item.price) * item.quantity).toFixed(2)} DA
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900 font-medium">{total.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-gray-600">À calculer</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-gray-900">Total Estimé</span>
                  <span className="text-rose-600">{total.toFixed(2)} DA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
