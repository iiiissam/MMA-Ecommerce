'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore, updateProfile, changePassword, logoutClient } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const { client, token, isAuthenticated, updateClient, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  
  // Profile form
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account/login')
    } else if (client) {
      setProfileData({
        first_name: client.first_name,
        last_name: client.last_name,
        phone: client.phone || '',
      })
    }
  }, [isAuthenticated, client, router])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      const updatedClient = await updateProfile(token, profileData)
      updateClient(updatedClient)
      setProfileSuccess('Profil mis à jour avec succès!')
    } catch (err: any) {
      setProfileError('Erreur lors de la mise à jour')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      await changePassword(token, passwordData)
      setPasswordSuccess('Mot de passe modifié avec succès!')
      setPasswordData({ current_password: '', new_password: '', new_password_confirm: '' })
    } catch (err: any) {
      try {
        const errors = JSON.parse(err.message)
        setPasswordError(errors.current_password || errors.new_password || 'Erreur lors du changement')
      } catch {
        setPasswordError('Erreur lors du changement de mot de passe')
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = async () => {
    if (token) {
      await logoutClient(token)
    }
    logout()
    router.push('/')
  }

  if (!isAuthenticated || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Compte</h1>
          <p className="text-gray-600">Bienvenue, {client.first_name}!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-center font-medium transition ${
                activeTab === 'profile'
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-4 px-6 text-center font-medium transition ${
                activeTab === 'password'
                  ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mot de passe
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {profileSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {profileError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={client.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">L'email ne peut pas être modifié</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition text-gray-900 bg-white"
                    placeholder="0550 00 00 00"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-rose-700 focus:ring-4 focus:ring-rose-500/50 transition disabled:opacity-50"
                >
                  {profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {passwordSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition text-gray-900 bg-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.new_password_confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password_confirm: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition text-gray-900 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-rose-700 focus:ring-4 focus:ring-rose-500/50 transition disabled:opacity-50"
                >
                  {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center space-y-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-red-600 hover:text-red-700 font-medium transition"
          >
            Se déconnecter
          </button>
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

