<template>
  <div class="booking-page">
    <section class="page-header">
      <div class="container">
        <h1>预约服务</h1>
        <p>填写以下信息，完成预约</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="booking-layout" v-if="character">
          <div class="booking-character-info">
            <div class="character-mini-card">
              <div class="mini-avatar" :style="character.avatar && !avatarError ? {} : { background: getGradient(character.id) }">
                <img v-if="character.avatar && !avatarError" :src="character.avatar" class="mini-avatar-img" @error="avatarError = true" />
                <span v-else>{{ character.name?.[0] || '?' }}</span>
              </div>
              <div class="mini-info">
                <h3>{{ character.name }}</h3>
                <p class="mini-price">¥{{ (character.price_per_hour || character.price || 10000).toLocaleString() }}円/時間</p>
              </div>
            </div>
          </div>

          <div class="booking-form-container">
            <form @submit.prevent="handleSubmit" class="booking-form">
              <div class="form-section">
                <h3>选择时间</h3>

                <div class="form-group">
                  <label class="form-label">预约日期</label>
                  <input
                    type="date"
                    v-model="form.date"
                    class="form-input"
                    :min="minDate"
                    required
                  />
                  <span class="form-error" v-if="errors.date">{{ errors.date }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">时间段</label>
                  <div class="time-slots">
                    <button
                      type="button"
                      v-for="slot in timeSlots"
                      :key="slot"
                      class="time-slot"
                      :class="{ active: form.time_slot === slot }"
                      @click="form.time_slot = slot"
                    >
                      {{ slot }}
                    </button>
                  </div>
                  <span class="form-error" v-if="errors.time_slot">{{ errors.time_slot }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">服务时长</label>
                  <div class="duration-options">
                    <button
                      type="button"
                      v-for="d in durationOptions"
                      :key="d.value"
                      class="duration-option"
                      :class="{ active: form.duration === d.value }"
                      @click="form.duration = d.value"
                    >
                      {{ d.label }}
                    </button>
                  </div>
                  <span class="form-error" v-if="errors.duration">{{ errors.duration }}</span>
                </div>
              </div>

              <div class="form-section">
                <h3>联系信息</h3>

                <div class="form-group">
                  <label class="form-label">您的姓名</label>
                  <input
                    type="text"
                    v-model="form.customer_name"
                    class="form-input"
                    placeholder="请输入您的姓名"
                    required
                  />
                  <span class="form-error" v-if="errors.customer_name">{{ errors.customer_name }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">联系电话</label>
                  <input
                    type="tel"
                    v-model="form.customer_phone"
                    class="form-input"
                    placeholder="请输入联系电话"
                    required
                  />
                  <span class="form-error" v-if="errors.customer_phone">{{ errors.customer_phone }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">备注（可选）</label>
                  <textarea
                    v-model="form.notes"
                    class="form-input"
                    rows="4"
                    placeholder="有任何特殊要求可以告诉我们..."
                  ></textarea>
                </div>
              </div>

              <div class="booking-summary" v-if="form.date && form.time_slot && form.duration">
                <h3>预约摘要</h3>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">角色</span>
                    <span class="summary-value">{{ character.name }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">日期</span>
                    <span class="summary-value">{{ form.date }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">时间</span>
                    <span class="summary-value">{{ form.time_slot }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">时长</span>
                    <span class="summary-value">{{ form.duration }}小时</span>
                  </div>
                  <div class="summary-item total">
                    <span class="summary-label">合計料金</span>
                    <span class="summary-value">¥{{ calculatePrice().toLocaleString() }}円</span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="goBack">返回</button>
                <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                  <span v-if="loading" class="spinner" style="width:20px;height:20px;"></span>
                  <span v-else>确认预约</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="loading-spinner" v-else-if="loading">
          <div class="spinner"></div>
        </div>

        <div class="error-page" v-else>
          <h2>角色不存在</h2>
          <router-link to="/characters" class="btn btn-primary">返回角色列表</router-link>
        </div>
      </div>
    </section>

    <div class="success-modal" v-if="showSuccess">
      <div class="success-content">
        <div class="success-icon">✦</div>
        <h2>预约成功！</h2>
        <p>您的预约已提交，我们会在24小时内确认。</p>
        <p class="success-order">订单号: {{ orderId }}</p>
        <router-link to="/user" class="btn btn-primary">查看订单</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const character = ref(null)
const avatarError = ref(false)
const showSuccess = ref(false)
const orderId = ref('')

const form = reactive({
  date: '',
  time_slot: '',
  duration: 2,
  customer_name: '',
  customer_phone: '',
  notes: ''
})

const errors = reactive({})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const timeSlots = [
  '09:00-11:00',
  '11:00-13:00',
  '14:00-16:00',
  '16:00-18:00',
  '19:00-21:00'
]

const durationOptions = [
  { label: '2小时', value: 2 },
  { label: '4小时', value: 4 },
  { label: '6小时', value: 6 },
  { label: '8小时', value: 8 }
]

const getGradient = (id) => {
  const gradients = [
    'linear-gradient(135deg, #3a1a40 0%, #201030 100%)',
    'linear-gradient(135deg, #1a2a40 0%, #101a30 100%)',
    'linear-gradient(135deg, #3a2020 0%, #201018 100%)',
    'linear-gradient(135deg, #1a3040 0%, #102030 100%)'
  ]
  return gradients[(id - 1) % gradients.length] || gradients[0]
}

const fetchCharacter = async () => {
  loading.value = true
  try {
    const response = await api.get(`/characters/${route.params.characterId}`)
    character.value = response.data
  } catch (error) {
    console.error('Failed to fetch character:', error)
    character.value = { id: route.params.characterId, name: '角色', price: 10000 }
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  let isValid = true
  errors.date = ''
  errors.time_slot = ''
  errors.duration = ''
  errors.customer_name = ''
  errors.customer_phone = ''

  if (!form.date) {
    errors.date = '请选择日期'
    isValid = false
  }

  if (!form.time_slot) {
    errors.time_slot = '请选择时间段'
    isValid = false
  }

  if (!form.duration) {
    errors.duration = '请选择时长'
    isValid = false
  }

  if (!form.customer_name.trim()) {
    errors.customer_name = '请输入姓名'
    isValid = false
  }

  if (!form.customer_phone.trim()) {
    errors.customer_phone = '请输入联系电话'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.customer_phone)) {
    errors.customer_phone = '请输入有效的手机号码'
    isValid = false
  }

  return isValid
}

const calculatePrice = () => {
  return (character.value?.price_per_hour || character.value?.price || 10000) * form.duration
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const token = localStorage.getItem('token')
  if (!token) {
    alert('请先登录')
    router.push('/user')
    return
  }

  loading.value = true

  try {
    const orderData = {
      character_id: parseInt(route.params.characterId),
      ...form
    }

    const response = await api.post('/orders', orderData)
    orderId.value = response.data.id || 'ORD' + Date.now()
    showSuccess.value = true
  } catch (error) {
    const msg = error._message || error.response?.data?.message || error.message || '预约失败，请重试'
    alert(msg)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchCharacter()
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

.booking-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  align-items: start;
}

.booking-character-info {
  position: sticky;
  top: 100px;
}

.character-mini-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  gap: 20px;
}

.mini-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.mini-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-avatar span {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.mini-info h3 {
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.mini-price {
  color: var(--accent);
  font-weight: 600;
  font-size:1.1rem;
}

.booking-form-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 40px;
  box-shadow: var(--card-shadow);
}

.form-section {
  margin-bottom: 40px;
}

.form-section h3 {
  font-size: 1.5rem;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.time-slots,
.duration-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.time-slot,
.duration-option {
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--card-bg-solid);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-align: center;
}

.time-slot:hover,
.duration-option:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.time-slot.active,
.duration-option.active {
  background: var(--bg-gradient);
  border-color: transparent;
  color: var(--text-color);
  font-weight: 600;
}

.booking-summary {
  background: var(--bg-color);
  border-radius: var(--border-radius);
  padding: 30px;
  margin: 30px 0;
}

.booking-summary h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.summary-grid {
  display: grid;
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-item.total {
  border-bottom: none;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--accent);
  padding-top: 20px;
}

.summary-label {
  color: var(--text-light);
}

.summary-value {
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 40px;
}

.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(74, 53, 64, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.success-content {
  background: var(--card-bg-solid);
  border-radius: var(--border-radius-lg);
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: modalIn 0.5s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-icon {
  font-size: 4rem;
  color: var(--primary);
  margin-bottom: 20px;
  animation: sparkle 2s ease infinite;
}

.success-content h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--text-color);
}

.success-content p {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.success-order {
  background: var(--bg-color);
  padding: 15px;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  color: var(--accent);
  margin: 20px 0 30px;
}

@media (max-width: 1024px) {
  .booking-layout {
    grid-template-columns: 1fr;
  }

  .booking-character-info {
    position: static;
  }
}

@media (max-width: 768px) {
  .booking-form-container {
    padding: 25px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
