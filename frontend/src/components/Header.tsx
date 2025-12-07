'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth'
import { useState } from 'react'

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { client, isAuthenticated } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-md">
              <span className="text-white font-bold text-2xl font-serif">É</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                Élégance Moderne
              </span>
              <span className="text-xs text-gray-500 tracking-widest uppercase">Boutique de Mode</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full px-6 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50 text-black"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                aria-label="Rechercher"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/collections"
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              Collections
            </Link>
            
            {/* User Account */}
            {isAuthenticated && client ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-rose-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {client.first_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{client.first_name}</span>
                  <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mon Profil
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => {
                        useAuthStore.getState().logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className="flex items-center gap-2 text-gray-700 hover:text-rose-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Connexion</span>
              </Link>
            )}
            
            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-rose-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-rose-600 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            <nav className="flex flex-col gap-3">
              <Link
                href="/collections"
                className="text-gray-700 hover:text-rose-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              
              {/* Mobile User Account */}
              {isAuthenticated && client ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-t border-gray-100 mt-2 pt-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {client.first_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.full_name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account/profile"
                    className="text-gray-700 hover:text-rose-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => {
                      useAuthStore.getState().logout()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-red-600 hover:text-red-700 font-medium py-2"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/account/login"
                  className="text-gray-700 hover:text-rose-600 font-medium py-2 flex items-center gap-2 border-t border-gray-100 mt-2 pt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Connexion
                </Link>
              )}
              
              <Link
                href="/cart"
                className="text-gray-700 hover:text-rose-600 font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Panier
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full px-2 py-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
