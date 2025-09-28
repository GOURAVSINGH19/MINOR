import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface AuthContextValue {
	token: string | null
	setToken: (t: string | null) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))

	function setToken(t: string | null) {
		setTokenState(t)
		if (t) localStorage.setItem('token', t)
		else localStorage.removeItem('token')
	}

	function logout() {
		setToken(null)
	}

	const value = useMemo(() => ({ token, setToken, logout }), [token])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
