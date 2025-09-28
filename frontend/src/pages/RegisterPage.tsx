import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../lib/api'
import { useAuth } from '../auth/AuthContext'

export default function RegisterPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const { setToken } = useAuth()

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		try {
			await registerUser(email, password)
			const res = await loginUser(email, password)
			setToken(res.access_token)
			navigate('/chat')
		} catch (err) {
			setError('Registration failed')
		}
	}

	return (
		<div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
			<form
				onSubmit={onSubmit}
				className="w-full max-w-sm space-y-5 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-black/30 backdrop-blur-md shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
			>
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold">Create account</h2>
					<p className="text-sm text-gray-600">Join to start chatting</p>
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<div className="space-y-3">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
						required
					/>
				</div>
				<button className="w-full px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black transition-transform duration-150 active:scale-[0.98]">
					Create account
				</button>
				<p className="text-sm text-gray-600">
					Already have an account? <Link className="underline" to="/login">Login</Link>
				</p>
			</form>
		</div>
	)
}
