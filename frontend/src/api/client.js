import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_URL
const apiBase = rawApiUrl
  ? `${rawApiUrl.replace(/\/+$/, '')}/api`
  : '/api'

const client = axios.create({
  baseURL: apiBase,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export default client
