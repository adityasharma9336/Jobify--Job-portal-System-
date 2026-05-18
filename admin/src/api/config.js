// API base URL for admin panel
// Uses relative URL in production (nginx proxies /api → backend)
// Uses localhost in development
const API_URL = import.meta.env.VITE_API_URL || '/api'
export default API_URL
