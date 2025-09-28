import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export function setAuthToken(token: string | null) {
	if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
	else delete api.defaults.headers.common['Authorization']
}

// Auth
export async function registerUser(email: string, password: string) {
	const res = await api.post('/auth/register', { email, password })
	return res.data
}

export async function loginUser(username: string, password: string) {
	const params = new URLSearchParams()
	params.append('username', username)
	params.append('password', password)
	return (await api.post('/auth/login', params)).data as { access_token: string; token_type: string }
}

// Chats
export async function listChats() {
	return (await api.get('/chats')).data as { id: string; createdAt: string }[]
}

export async function createChat() {
	return (await api.post('/chats')).data as { id: string; createdAt: string }
}

export async function getMessages(chatId: string) {
	return (await api.get(`/chats/${chatId}/messages`)).data as { id: string; sender: 'user' | 'bot'; text: string; timestamp: string }[]
}

export async function sendMessage(chatId: string, text: string) {
	return (await api.post(`/chats/${chatId}/message`, { text })).data as { id: string; sender: 'user' | 'bot'; text: string; timestamp: string }
}

export default api
