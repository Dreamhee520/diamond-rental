import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})
// Note: Do NOT set a default Content-Type header — axios auto-detects:
// - Plain object → application/json
// - FormData  → multipart/form-data (with boundary)

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - auto-unwrap {success, data} wrapper & handle errors
api.interceptors.response.use(
  (response) => {
    // Auto-unwrap backend's { success: true, data: ... } response format
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (error.response) {
      // Attach unified message onto the original error for downstream catch blocks
      error._message = error.response.data?.message || '请求失败'

      // Only auto-redirect on 401 for non-login requests;
      // login failures (401 on /auth/login) should propagate the error back to the form
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      if (error.response.status === 401 && !isLoginRequest) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/user'
      }

      // Preserve the original axios error so callers can access error.response
      return Promise.reject(error)
    } else if (error.request) {
      return Promise.reject(new Error('网络连接失败，请检查网络'))
    } else {
      return Promise.reject(new Error('请求配置错误'))
    }
  }
)

export default api
