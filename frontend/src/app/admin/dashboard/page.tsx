'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, removeAuthToken } from '@/lib/api'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/admin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    removeAuthToken()
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl font-serif">É</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-900">Élégance Moderne</h1>
              <p className="text-xs text-gray-500">Tableau de Bord Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Bienvenue dans le Panneau d'Administration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/products"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-rose-300 group"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Produits</h2>
            <p className="text-gray-600">Gérer les produits et variantes</p>
          </Link>
          <Link
            href="/admin/categories"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-rose-300 group"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Catégories</h2>
            <p className="text-gray-600">Gérer les catégories de produits</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-rose-300 group"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Commandes</h2>
            <p className="text-gray-600">Voir et gérer les commandes</p>
          </Link>
          <Link
            href="/admin/clients"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-rose-300 group"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Clients</h2>
            <p className="text-gray-600">Voir les comptes clients (éducatif)</p>
          </Link>
          <Link
            href="/admin/import-export"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-rose-300 group"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Import/Export</h2>
            <p className="text-gray-600">Importer en masse et exporter les données</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
