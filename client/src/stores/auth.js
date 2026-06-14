import { reactive, computed } from 'vue'
import api from '../services/api'

const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

// Initialize state from localStorage
const storedToken = localStorage.getItem('token')
const storedUser = localStorage.getItem('user')

if (storedToken && storedUser) {
  state.token = storedToken
  state.user = JSON.parse(storedUser)
  state.isAuthenticated = true
}

export function useAuth() {
  const login = async (username, password) => {
    state.loading = true
    state.error = null

    try {
      const response = await api.post('/auth/login', { username, password })
      const { token, user } = response.data

      state.token = token
      state.user = user
      state.isAuthenticated = true

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { success: true, user }
    } catch (error) {
      state.error = error.response?.data?.message || '登录失败，请重试'
      return { success: false, error: state.error }
    } finally {
      state.loading = false
    }
  }

  const register = async (username, password, email) => {
    state.loading = true
    state.error = null

    try {
      const response = await api.post('/auth/register', { username, password, email })
      return { success: true, data: response.data }
    } catch (error) {
      state.error = error.response?.data?.message || '注册失败，请重试'
      return { success: false, error: state.error }
    } finally {
      state.loading = false
    }
  }

  const logout = () => {
    state.user = null
    state.token = null
    state.isAuthenticated = false

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin = computed(() => {
    return state.user && state.user.role === 'admin'
  })

  return {
    state,
    login,
    register,
    logout,
    isAdmin
  }
}
