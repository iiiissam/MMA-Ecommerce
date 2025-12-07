'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Client {
    id: number
    email: string
    first_name: string
    last_name: string
    full_name: string
    phone: string
    created_at: string
}

interface AuthState {
    client: Client | null
    token: string | null
    isAuthenticated: boolean
    setAuth: (client: Client, token: string) => void
    logout: () => void
    updateClient: (client: Client) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            client: null,
            token: null,
            isAuthenticated: false,
            setAuth: (client, token) => set({ client, token, isAuthenticated: true }),
            logout: () => set({ client: null, token: null, isAuthenticated: false }),
            updateClient: (client) => set({ client }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

// API functions
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function registerClient(data: {
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
    phone?: string
}): Promise<{ client: Client; token: string }> {
    const response = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify(result))
    }

    return { client: result.client, token: result.token }
}

export async function loginClient(email: string, password: string): Promise<{ client: Client; token: string }> {
    const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify(result))
    }

    return { client: result.client, token: result.token }
}

export async function logoutClient(token: string): Promise<void> {
    await fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    })
}

export async function getProfile(token: string): Promise<Client> {
    const response = await fetch(`${API_URL}/auth/profile/`, {
        headers: { 'Authorization': `Token ${token}` },
    })

    if (!response.ok) {
        throw new Error('Not authenticated')
    }

    return response.json()
}

export async function updateProfile(token: string, data: {
    first_name?: string
    last_name?: string
    phone?: string
}): Promise<Client> {
    const response = await fetch(`${API_URL}/auth/profile/update/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify(result))
    }

    return result.client
}

export async function changePassword(token: string, data: {
    current_password: string
    new_password: string
    new_password_confirm: string
}): Promise<void> {
    const response = await fetch(`${API_URL}/auth/password/change/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const result = await response.json()
        throw new Error(JSON.stringify(result))
    }
}

export async function checkAuth(token: string): Promise<{ authenticated: boolean; client?: Client }> {
    const response = await fetch(`${API_URL}/auth/check/`, {
        headers: { 'Authorization': `Token ${token}` },
    })

    return response.json()
}

