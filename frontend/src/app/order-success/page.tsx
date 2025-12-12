'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference')

  useEffect(() => {
    if (!reference) {
      router.push('/collections')
    }
  }, [reference, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center border border-gray-200">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Commande Confirmée!</h1>
        <p className="text-xl text-gray-600 mb-2">Merci pour votre achat</p>

        {reference && (
          <div className="bg-rose-50 rounded-xl p-6 mb-8 mt-6 border border-rose-200">
            <p className="text-sm text-gray-600 mb-2">Référence de Commande</p>
            <p className="text-2xl font-bold text-rose-600 font-mono">{reference}</p>
            <p className="text-sm text-gray-600 mt-4">
              Nous vous contacterons bientôt pour confirmer votre commande.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/collections"
            className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Continuer vos Achats
          </Link>
          <div>
            <Link href="/" className="text-rose-600 hover:text-rose-700 font-medium">
              Retour à l'Accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
