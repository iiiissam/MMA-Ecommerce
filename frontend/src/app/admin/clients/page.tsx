'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

interface Client {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
  last_login: string | null
  created_at: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasFetched, setHasFetched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalClients, setTotalClients] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const itemsPerPage = 20

  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true)
      fetchClients(1)
    }
  }, [hasFetched])

  const fetchClients = async (page: number) => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/clients/?page=${page}`)
      const data = response.data.results || response.data
      setClients(data)
      setTotalClients(response.data.count || 0)
      setHasNext(!!response.data.next)
      setHasPrev(!!response.data.previous)
      setCurrentPage(page)
    } catch (err: any) {
      setError('Échec du chargement des clients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalClients / itemsPerPage)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !hasFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Comptes clients enregistrés (lecture seule)</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour au tableau de bord
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Note:</strong> Ce système d'authentification est à des fins éducatives uniquement. 
              Les comptes clients ne sont pas liés aux commandes.
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-500">Clients Actifs</p>
            <p className="text-3xl font-bold text-green-600">{clients.filter(c => c.is_active).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-500">Cette Page</p>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun client enregistré
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière Connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscription
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {client.first_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.first_name} {client.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalClients > itemsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => fetchClients(currentPage - 1)}
              disabled={!hasPrev}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              ← Précédent
            </button>
            
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md min-w-[100px] text-center">
                Page {currentPage}
              </span>
              <span className="text-sm text-gray-600">
                sur {totalPages} ({totalClients} clients)
              </span>
            </div>
            
            <button
              onClick={() => fetchClients(currentPage + 1)}
              disabled={!hasNext}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

