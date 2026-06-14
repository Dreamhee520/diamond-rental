<template>
  <div class="user-center-page">
    <section class="page-header">
      <div class="container">
        <h1>用户中心</h1>
        <p>管理您的账户和预约</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="!state.isAuthenticated" class="auth-container">
          <div class="auth-tabs">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'"
            >
              登录
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'"
            >
              注册
            </button>
          </div>

          <div class="auth-form-container">
            <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
              <h2>欢迎回来 ♥</h2>
              <p class="auth-subtitle">登录您的账户</p>

              <div class="form-group">
                <label class="form-label">用户名</label>
                <input
                  type="text"
                  v-model="loginForm.username"
                  class="form-input"
                  placeholder="请输入用户名"
                  required
                />
                <span class="form-error" v-if="loginErrors.username">{{ loginErrors.username }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">密码</label>
                <input
                  type="password"
                  v-model="loginForm.password"
                  class="form-input"
                  placeholder="请输入密码"
                  required
                />
                <span class="form-error" v-if="loginErrors.password">{{ loginErrors.password }}</span>
              </div>

              <div class="alert alert-error" v-if="loginError">
                {{ loginError }}
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="authLoading">
                <span v-if="authLoading" class="spinner" style="width:20px;height:20px;"></span>
                <span v-else>登录</span>
              </button>
            </form>

            <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
              <h2>加入我们 ✦</h2>
              <p class="auth-subtitle">创建您的账户</p>

              <div class="form-group">
                <label class="form-label">用户名</label>
                <input
                  type="text"
                  v-model="registerForm.username"
                  class="form-input"
                  placeholder="请输入用户名"
                  required
                />
                <span class="form-error" v-if="registerErrors.username">{{ registerErrors.username }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">邮箱（可选）</label>
                <input
                  type="email"
                  v-model="registerForm.email"
                  class="form-input"
                  placeholder="请输入邮箱"
                />
              </div>

              <div class="form-group">
                <label class="form-label">密码</label>
                <input
                  type="password"
                  v-model="registerForm.password"
                  class="form-input"
                  placeholder="请输入密码"
                  required
                />
                <span class="form-error" v-if="registerErrors.password">{{ registerErrors.password }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">确认密码</label>
                <input
                  type="password"
                  v-model="registerForm.confirmPassword"
                  class="form-input"
                  placeholder="请再次输入密码"
                  required
                />
                <span class="form-error" v-if="registerErrors.confirmPassword">{{ registerErrors.confirmPassword }}</span>
              </div>

              <div class="alert alert-error" v-if="registerError">
                {{ registerError }}
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="authLoading">
                <span v-if="authLoading" class="spinner" style="width:20px;height:20px;"></span>
                <span v-else>注册</span>
              </button>
            </form>
          </div>
        </div>

        <div v-else class="user-dashboard">
          <div class="user-sidebar">
            <div class="user-profile-card">
              <div class="user-avatar-large">
                {{ state.user?.username?.[0]?.toUpperCase() }}
              </div>
              <h3 class="user-name">{{ state.user?.username }}</h3>
              <p class="user-email">{{ state.user?.email || '未设置邮箱' }}</p>
            </div>

            <nav class="user-nav">
              <button
                class="user-nav-item"
                :class="{ active: activeSection === 'orders' }"
                @click="activeSection = 'orders'"
              >
                <span class="nav-icon">📋</span>
                我的订单
              </button>
              <button
                class="user-nav-item"
                :class="{ active: activeSection === 'profile' }"
                @click="activeSection = 'profile'"
              >
                <span class="nav-icon">👤</span>
                个人资料
              </button>
              <button
                class="user-nav-item"
                :class="{ active: activeSection === 'reviews' }"
                @click="activeSection = 'reviews'"
              >
                <span class="nav-icon">⭐</span>
                我的评价
              </button>
              <button
                class="user-nav-item logout"
                @click="handleLogout"
              >
                <span class="nav-icon">🚪</span>
                退出登录
              </button>
            </nav>
          </div>

          <div class="user-content">
            <div v-if="activeSection === 'orders'" class="orders-section">
              <h2>我的订单</h2>

              <div class="loading-spinner" v-if="ordersLoading">
                <div class="spinner"></div>
              </div>

              <div class="empty-state" v-else-if="orders.length === 0">
                <p>暂无订单</p>
                <router-link to="/characters" class="btn btn-primary">去预约</router-link>
              </div>

              <div class="orders-list" v-else>
                <div class="order-card" v-for="order in orders" :key="order.id">
                  <div class="order-header">
                    <span class="order-id">订单号: {{ order.id }}</span>
                    <span class="order-status" :class="order.status">{{ getStatusText(order.status) }}</span>
                  </div>
                  <div class="order-body">
                    <div class="order-info">
                      <p><strong>角色:</strong> {{ order.character_name || '未知' }}</p>
                      <p><strong>日期:</strong> {{ order.date }}</p>
                      <p><strong>时间:</strong> {{ order.time_slot }}</p>
                      <p><strong>时长:</strong> {{ order.duration }}小时</p>
                    </div>
                    <div class="order-price">
                      ¥{{ (order.price || 0).toLocaleString() }}円
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'profile'" class="profile-section">
              <h2>个人资料</h2>
              <div class="profile-form">
                <div class="form-group">
                  <label class="form-label">用户名</label>
                  <input
                    type="text"
                    :value="state.user?.username"
                    class="form-input"
                    disabled
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">邮箱</label>
                  <input
                    type="email"
                    :value="state.user?.email"
                    class="form-input"
                    disabled
                  />
                </div>
                <p class="profile-note">如需修改资料，请联系客服。</p>
              </div>
            </div>

            <div v-if="activeSection === 'reviews'" class="reviews-section">
              <h2>我的评价</h2>
              <div class="empty-state">
                <p>暂无评价</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '../stores/auth'
import api from '../services/api'

const { state, login, register, logout } = useAuth()

const activeTab = ref('login')
const activeSection = ref('orders')
const authLoading = ref(false)
const loginError = ref('')
const registerError = ref('')

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loginErrors = reactive({})
const registerErrors = reactive({})

const orders = ref([])
const ordersLoading = ref(false)

const handleLogin = async () => {
  loginErrors.username = ''
  loginErrors.password = ''
  loginError.value = ''

  if (!loginForm.username.trim()) {
    loginErrors.username = '请输入用户名'
    return
  }

  if (!loginForm.password) {
    loginErrors.password = '请输入密码'
    return
  }

  authLoading.value = true

  try {
    const result = await login(loginForm.username, loginForm.password)
    if (result.success) {
      loginForm.username = ''
      loginForm.password = ''
      // Redirect to the page the user was trying to access
      if (route.query.redirect) {
        router.push(route.query.redirect)
      }
    } else {
      loginError.value = result.error
    }
  } finally {
    authLoading.value = false
  }
}

const handleRegister = async () => {
  registerErrors.username = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
  registerError.value = ''

  if (!registerForm.username.trim()) {
    registerErrors.username = '请输入用户名'
    return
  }

  if (registerForm.password.length < 6) {
    registerErrors.password = '密码至少6位'
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = '两次密码不一致'
    return
  }

  authLoading.value = true

  try {
    const result = await register(registerForm.username, registerForm.password, registerForm.email)
    if (result.success) {
      alert('注册成功！请登录。')
      activeTab.value = 'login'
      registerForm.username = ''
      registerForm.email = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
    } else {
      registerError.value = result.error
    }
  } finally {
    authLoading.value = false
  }
}

const handleLogout = () => {
  logout()
  activeSection.value = 'orders'
}

const fetchOrders = async () => {
  ordersLoading.value = true
  try {
    const response = await api.get('/orders')
    orders.value = response.data
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    orders.value = []
  } finally {
    ordersLoading.value = false
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待确认',
    'confirmed': '已确认',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

onMounted(() => {
  if (state.isAuthenticated) {
    fetchOrders()
  }
})
</script>

<style scoped>
.page-header {
  background: var(--bg-gradient);
  padding: 120px 0 60px;
  text-align: center;
}

.page-header h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 15px;
  color: var(--text-color);
}

.page-header p {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.8;
}

.auth-container {
  max-width: 500px;
  margin: 0 auto;
}

.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  background: var(--bg-color);
  border-radius: var(--border-radius);
  padding: 5px;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  background: transparent;
  color: var(--text-light);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: var(--bg-gradient);
  color: var(--text-color);
  box-shadow: 0 2px 10px rgba(248, 200, 220, 0.3);
}

.auth-form-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 40px;
  box-shadow: var(--card-shadow);
}

.auth-form h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
}

.auth-subtitle {
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-light);
}

.user-dashboard {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  align-items: start;
}

.user-sidebar {
  position: sticky;
  top: 100px;
}

.user-profile-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 30px;
  text-align: center;
  box-shadow: var(--card-shadow);
  margin-bottom: 20px;
}

.user-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--bg-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.user-name {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.user-email {
  color: var(--text-light);
  font-size: 0.95rem;
}

.user-nav {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 15px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: transparent;
  color: var(--text-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: left;
}

.user-nav-item:hover {
  background: var(--bg-color);
}

.user-nav-item.active {
  background: var(--bg-gradient);
  font-weight: 600;
}

.user-nav-item.logout {
  color: #e74c3c;
  margin-top: 10px;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.nav-icon {
  font-size: 1.2rem;
}

.user-content {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 40px;
  box-shadow: var(--card-shadow);
  min-height: 500px;
}

.user-content h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: var(--primary);
  box-shadow: var(--card-shadow);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.order-id {
  font-weight: 600;
  color: var(--text-color);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.order-status.pending {
  background: rgba(212, 160, 96, 0.15);
  color: #f0d8a8;
}

.order-status.confirmed {
  background: rgba(76, 175, 128, 0.15);
  color: #6ecca0;
}

.order-status.completed {
  background: rgba(100, 160, 220, 0.15);
  color: #8cc0f0;
}

.order-status.cancelled {
  background: rgba(240, 100, 110, 0.15);
  color: #f09098;
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.order-info p {
  margin-bottom: 8px;
  color: var(--text-light);
}

.order-info p strong {
  color: var(--text-color);
  margin-right: 5px;
}

.order-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state p {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 20px;
}

.profile-note {
  color: var(--text-light);
  font-style: italic;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .user-dashboard {
    grid-template-columns: 1fr;
  }

  .user-sidebar {
    position: static;
  }

  .user-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .user-nav-item.logout {
    margin-top: 0;
    border-top: none;
    border-left: 1px solid var(--border-color);
  }
}

@media (max-width: 768px) {
  .auth-form-container {
    padding: 25px;
  }

  .user-content {
    padding: 25px;
  }
}
</style>
