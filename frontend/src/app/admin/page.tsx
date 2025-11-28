'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api, { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/api'
import axios from 'axios'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    if (getAuthToken()) {
      router.push('/admin/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Get auth token from Django REST Framework
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api-token-auth/`,
        { username, password }
      )

      if (response.data.token) {
        setAuthToken(response.data.token)
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError('Identifiants invalides. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-white font-bold text-2xl font-serif">É</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Connexion Admin</h1>
          <p className="text-gray-600">Élégance Moderne</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 px-4 rounded-lg hover:from-rose-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
