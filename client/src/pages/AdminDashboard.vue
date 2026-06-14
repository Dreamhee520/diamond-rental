<template>
  <div class="admin-page">
    <!-- Login Screen -->
    <section class="login-section" v-if="!isLoggedIn">
      <div class="login-card">
        <div class="login-header">
          <svg viewBox="0 0 40 40" width="60" height="60">
            <defs>
              <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f8c8dc" />
                <stop offset="100%" style="stop-color:#a8d8ea" />
              </linearGradient>
            </defs>
            <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="url(#lockGrad)" stroke="#fff" stroke-width="2"/>
            <text x="20" y="24" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">D</text>
          </svg>
          <h2>Diamond 管理后台</h2>
          <p class="login-subtitle">请使用管理员账号登录</p>
        </div>
        <form @submit.prevent="doLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input v-model="loginForm.username" class="form-input" placeholder="admin" required autocomplete="username" />
          </div>
          <div class="form-group">
            <label class="form-label">密码</label>
            <input v-model="loginForm.password" type="password" class="form-input" placeholder="admin123" required autocomplete="current-password" />
          </div>
          <div class="login-error" v-if="loginError">{{ loginError }}</div>
          <button type="submit" class="btn btn-primary login-btn" :disabled="loginLoading">
            <span v-if="loginLoading">登录中…</span>
            <span v-else>登录管理后台</span>
          </button>
        </form>
      </div>
    </section>

    <!-- Dashboard -->
    <template v-else>
      <section class="page-header">
        <div class="container">
          <h1>管理后台</h1>
          <p>管理角色数据 · 系统概览</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="admin-layout">
            <!-- Sidebar -->
            <div class="admin-sidebar">
              <nav class="admin-nav">
                <button class="admin-nav-item" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
                  <span class="nav-icon">📊</span> 仪表盘
                </button>
                <button class="admin-nav-item" :class="{ active: activeTab === 'characters' }" @click="activeTab = 'characters'">
                  <span class="nav-icon">👥</span> 角色管理
                </button>
                <button class="admin-nav-item logout-nav" @click="doLogout">
                  <span class="nav-icon">🚪</span> 退出登录
                </button>
              </nav>
            </div>

            <!-- Content -->
            <div class="admin-content">
              <!-- Dashboard Tab -->
              <div v-if="activeTab === 'dashboard'" class="tab-panel">
                <h2>系统概览</h2>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-icon" style="background:#fff3e0;">⭐</div>
                    <div class="stat-info">
                      <span class="stat-value">{{ characters.length }}</span>
                      <span class="stat-label">角色总数</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon" style="background:#e8f5e9;">✅</div>
                    <div class="stat-info">
                      <span class="stat-value">{{ characters.filter(c => c.status === 'active').length }}</span>
                      <span class="stat-label">活跃角色</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon" style="background:#fce4ec;">💰</div>
                    <div class="stat-info">
                      <span class="stat-value">¥{{ avgPrice.toLocaleString() }}</span>
                      <span class="stat-label">平均时给</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon" style="background:#e3f2fd;">📋</div>
                    <div class="stat-info">
                      <span class="stat-value">{{ orders.length }}</span>
                      <span class="stat-label">订单总数</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Characters Tab -->
              <div v-if="activeTab === 'characters'" class="tab-panel">
                <div class="tab-header-row">
                  <h2>角色管理</h2>
                  <button class="btn btn-primary" @click="openAddModal">+ 添加新角色</button>
                </div>

                <div v-if="loading" class="loading-spinner"><div class="spinner"></div></div>

                <div class="characters-admin-list" v-else>
                  <div class="character-admin-card" v-for="char in characters" :key="char.id">
                    <img
                      :src="char.avatar || '/images/characters/default.png'"
                      class="char-thumb"
                      @error="$event.target.style.display='none'; $event.target.nextSibling.style.display='flex'"
                      alt=""
                    />
                    <div class="char-thumb-fallback" :style="{ background: gradients[(char.id - 1) % 4] }">
                      {{ char.name?.[0] }}
                    </div>
                    <div class="char-admin-info">
                      <div class="char-name-row">
                        <h4>{{ char.name }} <span class="name-jp">{{ char.name_jp }}</span></h4>
                        <span class="status-tag" :class="char.status">{{ char.status === 'active' ? '上架中' : '已下架' }}</span>
                      </div>
                      <div class="char-tags">
                        <span class="role-tag">{{ char.role_tag || '未分类' }}</span>
                        <span class="price-tag">¥{{ (char.price_per_hour || 0).toLocaleString() }}円/時間</span>
                        <span class="price-tag day">¥{{ (char.price_per_day || 0).toLocaleString() }}円/日</span>
                      </div>
                      <p class="char-desc">{{ char.description?.slice(0, 80) }}{{ char.description?.length > 80 ? '…' : '' }}</p>
                    </div>
                    <div class="char-admin-actions">
                      <button class="btn btn-sm btn-secondary" @click="openEditModal(char)">编辑</button>
                      <button
                        class="btn btn-sm btn-outline"
                        :style="{ color: char.status === 'active' ? '#e74c3c' : '#27ae60', borderColor: char.status === 'active' ? '#e74c3c' : '#27ae60' }"
                        @click="toggleStatus(char)"
                      >
                        {{ char.status === 'active' ? '下架' : '上架' }}
                      </button>
                    </div>
                  </div>

                  <div class="empty-hint" v-if="characters.length === 0">
                    <p>还没有角色数据，点击上方「添加新角色」开始创建吧</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Character Form Modal -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editing ? '编辑角色' : '添加新角色' }}</h3>
            <button class="modal-close" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="saveCharacter" class="character-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">名称（中文）*</label>
                <input type="text" v-model="form.name" class="form-input" placeholder="水原千鹤" required />
              </div>
              <div class="form-group">
                <label class="form-label">名称（日文）</label>
                <input type="text" v-model="form.name_jp" class="form-input" placeholder="Mizuhara Chizuru" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">角色标签</label>
                <input type="text" v-model="form.role_tag" class="form-input" placeholder="全能型" />
              </div>
              <div class="form-group">
                <label class="form-label">评分 (0-5)</label>
                <input type="number" v-model.number="form.rating" class="form-input" min="0" max="5" step="0.1" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">简介</label>
              <textarea v-model="form.description" class="form-input" rows="3" placeholder="角色简介…"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">性格标签（逗号分隔）</label>
              <input type="text" v-model="form.personality_tags_input" class="form-input" placeholder="温柔体贴, 气质优雅, 全能陪伴" />
            </div>

            <div class="form-group">
              <label class="form-label">技能标签（逗号分隔）</label>
              <input type="text" v-model="form.skills_input" class="form-input" placeholder="陪伴约会, 逛街购物, 看电影" />
            </div>

            <div class="form-row form-row-3">
              <div class="form-group">
                <label class="form-label">时给 (円/時間)*</label>
                <input type="number" v-model.number="form.price_per_hour" class="form-input" min="0" step="1000" required />
              </div>
              <div class="form-group">
                <label class="form-label">日给 (円/日)</label>
                <input type="number" v-model.number="form.price_per_day" class="form-input" min="0" step="1000" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">可预约时段（逗号分隔，例如：09:00-12:00, 14:00-18:00）</label>
              <input type="text" v-model="form.available_hours_input" class="form-input" placeholder="09:00-12:00, 14:00-18:00, 19:00-22:00" />
            </div>

            <div class="form-section-title">🖼️ 角色图片</div>

            <!-- 头像 -->
            <div class="image-row">
              <div class="form-group" style="flex:1">
                <label class="form-label">头像</label>
                <div class="image-upload-box">
                  <div
                    class="upload-dropzone"
                    :class="{ 'has-image': form.avatar, 'is-uploading': imgUploading === 'avatar' }"
                    @click="triggerUpload('avatar')"
                    @dragover.prevent
                    @dragleave.prevent
                    @drop.prevent="handleDrop($event, 'avatar')"
                  >
                    <img v-if="form.avatar" :src="form.avatar" class="upload-preview" @error="form.avatar = ''" />
                    <div v-else class="upload-placeholder">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#bbb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      <span>点击或拖拽上传</span>
                    </div>
                    <div v-if="imgUploading === 'avatar'" class="upload-spinner-overlay">
                      <div class="spinner-white"></div>
                    </div>
                  </div>
                  <input type="file" ref="fileAvatar" accept="image/*" hidden @change="handleFile($event, 'avatar')" />
                  <div class="url-row">
                    <input type="text" v-model="form.avatar" class="form-input form-input-sm" placeholder="或输入图片 URL…" />
                    <button type="button" class="btn-icon" @click="form.avatar = ''" title="清除">✕</button>
                  </div>
                </div>
              </div>

              <!-- 全身照 -->
              <div class="form-group" style="flex:1">
                <label class="form-label">全身照</label>
                <div class="image-upload-box">
                  <div
                    class="upload-dropzone"
                    :class="{ 'has-image': form.full_body, 'is-uploading': imgUploading === 'full_body' }"
                    @click="triggerUpload('full_body')"
                    @dragover.prevent
                    @dragleave.prevent
                    @drop.prevent="handleDrop($event, 'full_body')"
                  >
                    <img v-if="form.full_body" :src="form.full_body" class="upload-preview" @error="form.full_body = ''" />
                    <div v-else class="upload-placeholder">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#bbb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      <span>点击或拖拽上传</span>
                    </div>
                    <div v-if="imgUploading === 'full_body'" class="upload-spinner-overlay">
                      <div class="spinner-white"></div>
                    </div>
                  </div>
                  <input type="file" ref="fileFullBody" accept="image/*" hidden @change="handleFile($event, 'full_body')" />
                  <div class="url-row">
                    <input type="text" v-model="form.full_body" class="form-input form-input-sm" placeholder="或输入图片 URL…" />
                    <button type="button" class="btn-icon" @click="form.full_body = ''" title="清除">✕</button>
                  </div>
                </div>
              </div>

              <!-- Banner -->
              <div class="form-group" style="flex:1">
                <label class="form-label">Banner</label>
                <div class="image-upload-box">
                  <div
                    class="upload-dropzone"
                    :class="{ 'has-image': form.banner, 'is-uploading': imgUploading === 'banner' }"
                    @click="triggerUpload('banner')"
                    @dragover.prevent
                    @dragleave.prevent
                    @drop.prevent="handleDrop($event, 'banner')"
                  >
                    <img v-if="form.banner" :src="form.banner" class="upload-preview" @error="form.banner = ''" />
                    <div v-else class="upload-placeholder">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#bbb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      <span>点击或拖拽上传</span>
                    </div>
                    <div v-if="imgUploading === 'banner'" class="upload-spinner-overlay">
                      <div class="spinner-white"></div>
                    </div>
                  </div>
                  <input type="file" ref="fileBanner" accept="image/*" hidden @change="handleFile($event, 'banner')" />
                  <div class="url-row">
                    <input type="text" v-model="form.banner" class="form-input form-input-sm" placeholder="或输入图片 URL…" />
                    <button type="button" class="btn-icon" @click="form.banner = ''" title="清除">✕</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving">保存中…</span>
                <span v-else>{{ editing ? '更新角色' : '添加角色' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '../stores/auth'
import api from '../services/api'

const { state: authState, login, logout } = useAuth()

// --- Login ---
const isLoggedIn = computed(() => authState.isAuthenticated && authState.user?.role === 'admin')
const loginForm = reactive({ username: '', password: '' })
const loginError = ref('')
const loginLoading = ref(false)

const doLogin = async () => {
  loginError.value = ''
  loginLoading.value = true
  const result = await login(loginForm.username, loginForm.password)
  loginLoading.value = false
  if (!result.success) {
    loginError.value = result.error || '登录失败'
    return
  }
  if (authState.user?.role !== 'admin') {
    loginError.value = '该账号无管理员权限'
    logout()
    return
  }
  fetchData()
}

const doLogout = () => {
  logout()
  activeTab.value = 'dashboard'
  characters.value = []
  orders.value = []
}

// --- Tabs ---
const activeTab = ref('dashboard')
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editing = ref(null)
const imgUploading = ref('')  // 'avatar' | 'full_body' | 'banner' | ''

const fileAvatar = ref(null)
const fileFullBody = ref(null)
const fileBanner = ref(null)

const fileRefs = { avatar: fileAvatar, full_body: fileFullBody, banner: fileBanner }

const characters = ref([])
const orders = ref([])

const gradients = [
  'linear-gradient(135deg, #f8c8dc, #f5a6b8)',
  'linear-gradient(135deg, #a8d8ea, #7ec8e3)',
  'linear-gradient(135deg, #ffd1dc, #ffb6c1)',
  'linear-gradient(135deg, #b5e6d8, #7ec8e3)',
]

const avgPrice = computed(() => {
  const active = characters.value.filter(c => c.status === 'active' && c.price_per_hour)
  if (!active.length) return 0
  return Math.round(active.reduce((s, c) => s + c.price_per_hour, 0) / active.length)
})

// --- Form ---
const defaultForm = () => ({
  name: '', name_jp: '', role_tag: '', description: '',
  personality_tags_input: '', skills_input: '',
  price_per_hour: 15000, price_per_day: 100000, rating: 5.0,
  available_hours_input: '09:00-12:00, 14:00-18:00',
  avatar: '', full_body: '', banner: ''
})

const form = reactive(defaultForm())

const openAddModal = () => {
  editing.value = null
  Object.assign(form, defaultForm())
  showModal.value = true
}

const openEditModal = (char) => {
  editing.value = char
  form.name = char.name
  form.name_jp = char.name_jp || ''
  form.role_tag = char.role_tag || ''
  form.description = char.description || ''
  form.personality_tags_input = (char.personality_tags || []).join(', ')
  form.skills_input = (char.skills || []).join(', ')
  form.price_per_hour = char.price_per_hour || 15000
  form.price_per_day = char.price_per_day || 100000
  form.rating = char.rating || 5.0
  form.available_hours_input = (char.available_hours || []).join(', ')
  form.avatar = char.avatar || ''
  form.full_body = char.full_body || ''
  form.banner = char.banner || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editing.value = null
}

const saveCharacter = async () => {
  saving.value = true
  try {
    const data = {
      name: form.name,
      name_jp: form.name_jp,
      role_tag: form.role_tag,
      description: form.description,
      personality_tags: form.personality_tags_input.split(',').map(s => s.trim()).filter(Boolean),
      skills: form.skills_input.split(',').map(s => s.trim()).filter(Boolean),
      price_per_hour: form.price_per_hour,
      price_per_day: form.price_per_day,
      rating: form.rating,
      available_hours: form.available_hours_input.split(',').map(s => s.trim()).filter(Boolean),
      avatar: form.avatar,
      full_body: form.full_body,
      banner: form.banner
    }

    if (editing.value) {
      await api.put(`/characters/${editing.value.id}`, data)
    } else {
      await api.post('/characters', data)
    }
    closeModal()
    fetchData()
    activeTab.value = 'characters'
  } catch (err) {
    alert('保存失败: ' + (err.response?.data?.message || err.message))
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (char) => {
  const newStatus = char.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '上架' : '下架'
  if (!confirm(`确定要${action}「${char.name}」吗？`)) return
  try {
    await api.put(`/characters/${char.id}`, { status: newStatus })
    fetchData()
  } catch (err) {
    alert('操作失败: ' + (err.response?.data?.message || err.message))
  }
}

// --- Image Upload ---
const triggerUpload = (field) => {
  fileRefs[field]?.value?.click()
}

const handleFile = async (event, field) => {
  const file = event.target.files?.[0]
  if (!file) return
  await uploadImage(file, field)
  // Reset input so same file can be re-selected
  event.target.value = ''
}

const handleDrop = async (event, field) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await uploadImage(file, field)
}

const uploadImage = async (file, field) => {
  // Validate type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    alert('仅支持 JPG/PNG/WebP/GIF/BMP/SVG 格式')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('图片大小不能超过 10MB')
    return
  }

  imgUploading.value = field
  try {
    const formData = new FormData()
    formData.append('image', file)
    // axios interceptor auto-unwraps {success, data} → data
    // axios auto-sets Content-Type: multipart/form-data with boundary for FormData
    const res = await api.post('/admin/upload', formData)
    if (res.data?.url) {
      form[field] = res.data.url
    } else {
      alert('上传失败: ' + (res.data?.message || '未知错误'))
    }
  } catch (err) {
    alert('上传失败: ' + (err.response?.data?.message || err.message))
  } finally {
    imgUploading.value = ''
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const [charRes, orderRes] = await Promise.all([
      api.get('/admin/characters'),
      api.get('/admin/orders').catch(() => ({ data: { orders: [] } }))
    ])
    characters.value = charRes.data || []
    orders.value = orderRes.data?.orders || []
  } catch (err) {
    console.error('Fetch data error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) fetchData()
})
</script>

<style scoped>
/* === Login === */
.login-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff5f7 0%, #e8f4f8 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(248, 200, 220, 0.25);
  text-align: center;
}

.login-header svg { margin-bottom: 20px; }

.login-header h2 {
  font-size: 1.6rem;
  margin-bottom: 8px;
  color: #333;
}

.login-subtitle { color: #999; font-size: 0.95rem; margin-bottom: 30px; }

.login-form { text-align: left; }
.login-form .form-group { margin-bottom: 18px; }

.login-error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 15px;
  text-align: center;
}

.login-btn { width: 100%; justify-content: center; padding: 14px; font-size: 1.05rem; }

/* === Layout === */
.page-header {
  background: linear-gradient(135deg, #fff5f7 0%, #e8f4f8 100%);
  padding: 120px 0 60px;
  text-align: center;
}
.page-header h1 { font-size: 2.4rem; margin-bottom: 8px; }
.page-header p { color: #888; font-size: 1.1rem; }

.admin-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 30px;
  align-items: start;
}

.admin-sidebar { position: sticky; top: 100px; }

.admin-nav {
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: transparent;
  color: #555;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}
.admin-nav-item:hover { background: #f5f5f5; color: #333; }
.admin-nav-item.active { background: linear-gradient(135deg, #f8c8dc, #f5a6b8); color: #fff; font-weight: 600; }
.logout-nav { margin-top: auto; color: #999; }
.logout-nav:hover { color: #e74c3c; background: #fef0f0; }
.nav-icon { font-size: 1.1rem; }

.admin-content {
  background: white;
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  min-height: 500px;
}

.tab-panel h2 {
  font-size: 1.5rem;
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.tab-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}
.tab-header-row h2 {
  font-size: 1.5rem;
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* === Stats === */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}
.stat-card {
  background: #fafafa;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-2px); }
.stat-icon {
  width: 50px; height: 50px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.stat-value { font-size: 1.6rem; font-weight: 700; color: #333; display: block; }
.stat-label { font-size: 0.85rem; color: #999; margin-top: 2px; display: block; }

/* === Character List === */
.characters-admin-list { display: flex; flex-direction: column; gap: 12px; }

.character-admin-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px;
  background: #fafafa;
  border-radius: 14px;
  transition: box-shadow 0.2s;
}
.character-admin-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

.char-thumb {
  width: 70px; height: 70px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.char-thumb-fallback {
  width: 70px; height: 70px;
  border-radius: 12px;
  display: none;
  align-items: center; justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.char-admin-info { flex: 1; min-width: 0; }
.char-name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
.char-name-row h4 { font-size: 1.1rem; margin: 0; }
.name-jp { color: #aaa; font-size: 0.85rem; }

.status-tag {
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
}
.status-tag.active { background: #e8f5e9; color: #2e7d32; }
.status-tag.inactive { background: #fce4ec; color: #c62828; }

.char-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.role-tag {
  background: linear-gradient(135deg, #f8c8dc, #f5a6b8);
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
.price-tag {
  background: #f5f5f5;
  color: #666;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}
.price-tag.day { color: #999; }

.char-desc {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.char-admin-actions { display: flex; gap: 8px; flex-shrink: 0; }

.empty-hint { text-align: center; padding: 60px 20px; color: #bbb; }

/* === Modal === */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 2000;
  display: flex;
  align-items: center; justify-content: center;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 35px;
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}
.modal-header h3 { font-size: 1.3rem; }
.modal-close {
  background: none;
  font-size: 1.5rem;
  color: #999;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
}
.modal-close:hover { background: #f5f5f5; color: #333; }

/* === Form === */
.character-form { display: flex; flex-direction: column; gap: 16px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row-3 { grid-template-columns: 1fr 1fr 1fr; }

.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 0.85rem; font-weight: 600; color: #555; }
.form-input {
  padding: 10px 14px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fafafa;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #f5a6b8; outline: none; background: white; }
textarea.form-input { resize: vertical; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

/* === Buttons === */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 22px; border-radius: 10px;
  font-size: 0.9rem; font-weight: 600;
  transition: all 0.2s;
}
.btn-primary { background: linear-gradient(135deg, #f8c8dc, #f5a6b8); color: white; }
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: #f0f0f0; color: #555; }
.btn-secondary:hover { background: #e0e0e0; }
.btn-outline { background: transparent; border: 2px solid #ddd; color: #555; }
.btn-outline:hover { background: #fafafa; }
.btn-sm { padding: 6px 14px; font-size: 0.82rem; border-radius: 8px; }

/* === Spinner === */
.loading-spinner { display: flex; justify-content: center; padding: 60px; }
.spinner {
  width: 40px; height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #f5a6b8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* === Image Upload === */
.form-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
}

.image-row {
  display: flex;
  gap: 16px;
}

.image-upload-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-dropzone {
  width: 100%;
  aspect-ratio: 3 / 4;
  border: 2px dashed #ddd;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: #fafafa;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-dropzone:hover {
  border-color: #f5a6b8;
  background: #fff5f7;
}

.upload-dropzone.has-image {
  border-style: solid;
  border-color: #e0e0e0;
}

.upload-dropzone.is-uploading {
  pointer-events: none;
  opacity: 0.7;
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #bbb;
  font-size: 0.8rem;
  text-align: center;
  padding: 16px;
}

.upload-spinner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.spinner-white {
  width: 32px; height: 32px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.url-row {
  display: flex;
  gap: 4px;
}

.form-input-sm {
  padding: 7px 10px;
  font-size: 0.8rem;
  flex: 1;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f5f5f5;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all 0.15s;
  flex-shrink: 0;
}
.btn-icon:hover { background: #fee; color: #e74c3c; }

/* === Responsive === */
@media (max-width: 900px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-sidebar { position: static; }
  .admin-nav { flex-direction: row; overflow-x: auto; }
  .logout-nav { margin-top: 0; }
  .form-row, .form-row-3 { grid-template-columns: 1fr; }
}
</style>
