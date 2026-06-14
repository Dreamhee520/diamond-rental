<template>
  <div class="character-detail-page" v-if="character">
    <section class="character-hero">
      <div class="container">
        <div class="character-hero-content">
          <div class="character-portrait">
            <div class="portrait-bg" :style="character.avatar && !avatarError ? {} : { background: getGradient(character.id) }">
              <img v-if="character.avatar && !avatarError" :src="character.avatar" class="portrait-img" @error="avatarError = true" />
              <span v-else class="portrait-initial">{{ character.name?.[0] || '?' }}</span>
            </div>
            <div class="decorative-circle circle-1"></div>
            <div class="decorative-circle circle-2"></div>
            <div class="decorative-sparkle">✦</div>
          </div>

          <div class="character-info">
            <div class="character-header">
              <h1>{{ character.name }}</h1>
              <span class="character-name-jp">{{ character.name_jp }}</span>
            </div>

            <div class="character-meta">
              <div class="meta-item">
                <span class="meta-label">年龄</span>
                <span class="meta-value">{{ character.age || 22 }}岁</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">身高</span>
                <span class="meta-value">{{ character.height || 162 }}cm</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">评分</span>
                <span class="meta-value rating">
                  ★ {{ character.rating || '4.8' }}
                </span>
              </div>
            </div>

            <div class="role-tag-hero" v-if="character.role_tag">{{ character.role_tag }}</div>

            <div class="character-tags">
              <span class="tag" v-for="tag in (character.personality_tags || character.tags || ['温柔', '可爱'])" :key="tag">{{ tag }}</span>
            </div>

            <p class="character-bio">{{ character.description || character.bio || '温柔体贴，善解人意。喜欢看书、听音乐，也喜欢和人交流。每一次陪伴都会用心对待，让您感受到温暖与关怀。' }}</p>

            <div class="character-price">
              <span class="price-label">料金</span>
              <span class="price-value">¥{{ (character.price_per_hour || character.price || 10000).toLocaleString() }}円</span>
              <span class="price-unit">/時間</span>
            </div>

            <button class="btn btn-primary btn-lg" @click="openBooking">
              立即预约 ✦
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="detail-grid">
          <div class="detail-main">
            <div class="detail-section">
              <h2>提供服务</h2>
              <div class="services-list">
                <div class="service-item" v-for="service in character.services || defaultServices" :key="service.id">
                  <div class="service-icon-small">
                    <span>{{ service.icon || '❤' }}</span>
                  </div>
                  <div class="service-info">
                    <h4>{{ service.name }}</h4>
                    <p>{{ service.description }}</p>
                  </div>
                  <div class="service-price">
                    ¥{{ (service.price || service.base_price || character.price_per_hour || 10000).toLocaleString() }}円
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h2>用户评价</h2>
              <div class="reviews-list">
                <ReviewCard
                  v-for="review in character.reviews || defaultReviews"
                  :key="review.id"
                  :review="review"
                />
              </div>
            </div>
          </div>

          <div class="detail-sidebar">
            <div class="sidebar-card">
              <h3>可预约时间</h3>
              <div class="time-slots-list">
                <div class="time-slot-item" v-for="slot in timeSlots" :key="slot">
                  <span class="slot-day">{{ slot.day }}</span>
                  <span class="slot-time">{{ slot.time }}</span>
                </div>
              </div>
            </div>

            <div class="sidebar-card">
              <h3>注意事项</h3>
              <ul class="notice-list">
                <li>请提前至少2小时预约</li>
                <li>取消预约请提前1小时</li>
                <li>请保持礼貌和尊重</li>
                <li>服务地点需为公共场所</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingModal
      v-if="showBooking"
      :characterId="character.id"
      :characterName="character.name"
      :characterPrice="character.price_per_hour || character.price || 299"
      @close="showBooking = false"
      @submit="handleBooking"
    />
  </div>

  <div class="loading-spinner" v-else-if="loading">
    <div class="spinner"></div>
  </div>

  <div class="error-page" v-else>
    <div class="container">
      <h2>角色不存在</h2>
      <router-link to="/characters" class="btn btn-primary">返回角色列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CharacterCard from '../components/CharacterCard.vue'
import ReviewCard from '../components/ReviewCard.vue'
import BookingModal from '../components/BookingModal.vue'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const character = ref(null)
const showBooking = ref(false)
const avatarError = ref(false)

const defaultServices = [
  { id: 1, name: '陪伴服务', icon: '♥', description: '安静的陪伴，倾听您的心声', price: 299 },
  { id: 2, name: '聊天服务', icon: '☕', description: '轻松愉快的话题聊天', price: 199 },
  { id: 3, name: '用餐陪伴', icon: '🍽', description: '一起享用美味的餐点', price: 349 }
]

const defaultReviews = [
  {
    id: 1,
    name: '田中先生',
    rating: 5,
    date: '2024-01-15',
    content: '非常温柔体贴的陪伴，让人感觉很舒服。会再次预约的！'
  },
  {
    id: 2,
    name: '佐藤さん',
    rating: 5,
    date: '2024-01-10',
    content: '聊得很开心，就像失散多年的朋友一样。强烈推荐！'
  }
]

const timeSlots = [
  { day: '周一至周五', time: '09:00-21:00' },
  { day: '周末', time: '10:00-22:00' }
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
    const response = await api.get(`/characters/${route.params.id}`)
    character.value = response.data
  } catch (error) {
    console.error('Failed to fetch character:', error)
    character.value = getDefaultCharacter()
  } finally {
    loading.value = false
  }
}

const getDefaultCharacter = () => {
  const id = parseInt(route.params.id) || 1
  const characters = [
    { id: 1, name: '千鹤', name_jp: '千鶴', age: 23, height: 165, tags: ['温柔', '大姐姐'], price: 299, rating: 4.9 },
    { id: 2, name: '小百合', name_jp: '小百合', age: 21, height: 158, tags: ['可爱', '活泼'], price: 259, rating: 4.8 },
    { id: 3, name: '美咲', name_jp: '美咲', age: 24, height: 163, tags: ['知性', '优雅'], price: 349, rating: 4.9 },
    { id: 4, name: '樱', name_jp: '桜', age: 20, height: 160, tags: ['清纯', '温柔'], price: 279, rating: 4.7 }
  ]
  return characters[(id - 1) % characters.length] || characters[0]
}

const openBooking = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/user')
    return
  }
  showBooking.value = true
}

const handleBooking = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData)
    showBooking.value = false
    alert('预约成功！请在用户中心查看订单状态。')
  } catch (error) {
    const msg = error._message || error.response?.data?.message || error.message || '预约失败，请重试'
    alert(msg)
  }
}

onMounted(() => {
  fetchCharacter()
})
</script>

<style scoped>
.character-hero {
  background: var(--bg-gradient-dark);
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
}

.character-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -25%;
  width: 150%;
  height: 200%;
  background: radial-gradient(ellipse at 30% 20%, rgba(240, 176, 200, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(180, 160, 220, 0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(212, 160, 96, 0.04) 0%, transparent 50%);
  pointer-events: none;
}

.character-hero-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 60px;
  align-items: start;
}

.character-portrait {
  position: relative;
  text-align: center;
}

.portrait-bg {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.portrait-initial {
  font-size: 6rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.decorative-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--primary);
  opacity: 0.3;
}

.circle-1 {
  width: 320px;
  height: 320px;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation: rotate 20s linear infinite;
}

.circle-2 {
  width: 360px;
  height: 360px;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  animation: rotate 30s linear infinite reverse;
}

@keyframes rotate {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

.decorative-sparkle {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: var(--primary-dark);
  animation: sparkle 3s ease-in-out infinite;
}

.character-header {
  margin-bottom: 20px;
}

.character-header h1 {
  font-size: 2.5rem;
  display: inline;
  margin-right: 15px;
}

.character-name-jp {
  font-size: 1.2rem;
  color: var(--text-light);
}

.character-meta {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-label {
  font-size: 0.85rem;
  color: var(--text-lighter);
}

.meta-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.meta-value.rating {
  color: #ffd700;
}

.role-tag-hero {
  display: inline-block;
  padding: 6px 20px;
  background: linear-gradient(135deg, #3a1a3a 0%, #1a2a40 100%);
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 0.05em;
  border: 1px solid var(--card-border);
}

.character-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
}

.tag {
  padding: 6px 16px;
  background: var(--primary-light);
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.character-bio {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 30px;
}

.character-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 30px;
}

.price-label {
  font-size: 0.95rem;
  color: var(--text-lighter);
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
}

.price-unit {
  font-size: 1rem;
  color: var(--text-light);
}

.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.detail-section {
  margin-bottom: 50px;
}

.detail-section h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-color);
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--bg-color);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.service-item:hover {
  transform: translateX(5px);
  box-shadow: var(--card-shadow);
}

.service-icon-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-gradient-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 1px solid var(--card-border);
}

.service-info {
  flex: 1;
}

.service-info h4 {
  margin-bottom: 5px;
}

.service-info p {
  font-size: 0.9rem;
}

.service-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--accent);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--card-shadow);
}

.sidebar-card h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.time-slot-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.slot-day {
  font-weight: 500;
}

.slot-time {
  color: var(--text-light);
}

.notice-list {
  list-style: none;
}

.notice-list li {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-light);
  position: relative;
  padding-left: 20px;
}

.notice-list li::before {
  content: '✦';
  position: absolute;
  left: 0;
  color: var(--primary);
}

@media (max-width: 1024px) {
  .character-hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .character-portrait {
    margin-bottom: 40px;
  }

  .character-meta {
    justify-content: center;
  }

  .character-tags {
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .portrait-bg {
    width: 200px;
    height: 200px;
  }

  .portrait-initial {
    font-size: 4rem;
  }

  .character-header h1 {
    font-size: 2rem;
  }
}
</style>
