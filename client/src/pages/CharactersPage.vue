<template>
  <div class="characters-page">
    <!-- Background decoration -->
    <div class="page-bg">
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
      <div class="bg-glow bg-glow-3"></div>
      <div class="bg-glow bg-glow-4"></div>
      <div class="bg-grid"></div>
      <div class="bg-particles">
        <div class="bg-particle" v-for="n in 20" :key="n" :style="particleStyle(n)"></div>
      </div>
      <!-- Floating diamond shapes -->
      <div class="floating-shapes">
        <svg v-for="n in 6" :key="'shape-'+n" class="float-diamond" :style="diamondStyle(n)" viewBox="0 0 40 40"><path d="M20 4 L34 20 L20 36 L6 20 Z" fill="none" :stroke="n%3===0?'rgba(248,200,220,0.2)':n%3===1?'rgba(200,216,240,0.18)':'rgba(212,160,96,0.15)'" stroke-width="0.8"/></svg>
      </div>
    </div>

    <section class="page-header">
      <div class="container">
        <div class="header-badge">
          <span class="badge-icon">◆</span>
          キャラクター一覧
        </div>
        <h1>选择您的专属陪伴</h1>
        <p>每一位角色都独一无二，找到最适合您的那一款</p>
        <div class="header-line"></div>
      </div>
    </section>

    <section class="section characters-section">
      <!-- Card area background -->
      <div class="cards-bg">
        <div class="cards-bg-aura cards-bg-aura-1"></div>
        <div class="cards-bg-aura cards-bg-aura-2"></div>
      </div>

      <div class="container">
        <div class="filters">
          <div class="filter-group">
            <label>排序方式</label>
            <select v-model="sortBy" class="form-input">
              <option value="popular">最受欢迎</option>
              <option value="price-asc">料金が安い順</option>
              <option value="price-desc">料金が高い順</option>
              <option value="rating">评分最高</option>
            </select>
          </div>

          <div class="filter-group">
            <label>性格标签</label>
            <div class="tag-filters">
              <button
                class="tag-filter"
                :class="{ active: selectedTag === '' }"
                @click="selectedTag = ''"
              >
                全部
              </button>
              <button
                v-for="tag in allTags"
                :key="tag"
                class="tag-filter"
                :class="{ active: selectedTag === tag }"
                @click="selectedTag = tag"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-4" v-if="!loading && filteredCharacters.length > 0">
          <CharacterCard
            v-for="character in filteredCharacters"
            :key="character.id"
            :character="character"
            @click="goToCharacter"
            @book="goToBooking"
          />
        </div>

        <div class="loading-spinner" v-else-if="loading">
          <div class="spinner"></div>
        </div>

        <div class="empty-state" v-else>
          <svg viewBox="0 0 80 80" width="80" height="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"><path d="M40 8 L68 28 L40 68 L12 28 Z"/><circle cx="40" cy="35" r="6"/></svg>
          <p>暂无符合条件的角色</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CharacterCard from '../components/CharacterCard.vue'
import api from '../services/api'
import { useAuth } from '../stores/auth'

const router = useRouter()

const loading = ref(false)
const characters = ref([])
const sortBy = ref('popular')
const selectedTag = ref('')

const allTags = computed(() => {
  const tagSet = new Set()
  characters.value.forEach(c => {
    const tags = c.personality_tags || c.tags || []
    tags.forEach(t => tagSet.add(t))
  })
  return [...tagSet]
})

const filteredCharacters = computed(() => {
  let result = [...characters.value]

  if (selectedTag.value) {
    result = result.filter(c => {
      const tags = c.personality_tags || c.tags || []
      return tags.includes(selectedTag.value)
    })
  }

  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => (a.price_per_hour || a.price || 10000) - (b.price_per_hour || b.price || 10000))
      break
    case 'price-desc':
      result.sort((a, b) => (b.price_per_hour || b.price || 10000) - (a.price_per_hour || a.price || 10000))
      break
    case 'rating':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    default:
      break
  }

  return result
})

const fetchCharacters = async () => {
  loading.value = true
  try {
    const response = await api.get('/characters')
    characters.value = response.data
  } catch (error) {
    console.error('Failed to fetch characters:', error)
    characters.value = getDefaultCharacters()
  } finally {
    loading.value = false
  }
}

const getDefaultCharacters = () => {
  return [
    { id: 1, name: '千鹤', name_jp: '千鶴', tags: ['温柔', '大姐姐'], price: 20000, available: true, rating: 4.9 },
    { id: 2, name: '七海麻美', name_jp: '七海麻美', tags: ['可爱', '活泼'], price: 15000, available: true, rating: 4.8 },
    { id: 3, name: '更科瑠夏', name_jp: '更科瑠夏', tags: ['元气', '主动'], price: 16000, available: true, rating: 4.7 },
    { id: 4, name: '樱', name_jp: '桜', tags: ['清纯', '温柔'], price: 12000, available: true, rating: 4.9 },
    { id: 5, name: '绫野美咲', name_jp: '綾野美咲', tags: ['知性', '优雅'], price: 22000, available: true, rating: 4.8 },
    { id: 6, name: '皐月凛', name_jp: '皐月凛', tags: ['高冷', '御姐'], price: 25000, available: true, rating: 4.7 },
    { id: 7, name: '渚ことみ', name_jp: '渚ことみ', tags: ['清纯', '可爱'], price: 10000, available: true, rating: 4.9 },
    { id: 8, name: '玲奈', name_jp: '玲奈', tags: ['元气', '辣妹'], price: 14000, available: true, rating: 4.6 }
  ]
}

const goToCharacter = (id) => {
  router.push(`/characters/${id}`)
}

const goToBooking = (characterId) => {
  const { state } = useAuth()
  if (!state.isAuthenticated) {
    router.push({ path: '/user', query: { redirect: `/booking/${characterId}` } })
    return
  }
  router.push(`/booking/${characterId}`)
}

const particleStyle = (n) => {
  const left = ((n * 43 + 17) % 100)
  const top = ((n * 67 + 23) % 100)
  const size = 1.5 + (n % 4) * 1.2
  const delay = (n * 1.3) % 9
  const duration = 8 + (n % 10)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.12 + (n % 6) * 0.03
  }
}

const diamondStyle = (n) => {
  const left = ((n * 73 + 31) % 85) + 5
  const top = ((n * 59 + 19) % 80) + 10
  const size = 24 + (n * 7) % 40
  const delay = (n * 1.7) % 6
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}

onMounted(() => {
  fetchCharacters()
})
</script>

<style scoped>
.characters-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* ==========================================
   FULL-PAGE BACKGROUND
   ========================================== */
.page-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  animation: glowPulse 10s ease-in-out infinite;
}

.bg-glow-1 {
  width: 700px; height: 700px;
  top: -250px; right: -180px;
  background: radial-gradient(circle, #f8c8dc 0%, rgba(248,200,220,0.3) 40%, transparent 70%);
  opacity: 0.18;
  animation-delay: 0s;
}

.bg-glow-2 {
  width: 600px; height: 600px;
  bottom: -200px; left: -120px;
  background: radial-gradient(circle, #c8d8f0 0%, rgba(200,216,240,0.3) 40%, transparent 70%);
  opacity: 0.16;
  animation-delay: 3.3s;
}

.bg-glow-3 {
  width: 450px; height: 450px;
  top: 55%; left: 45%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(212,160,96,0.25) 0%, transparent 70%);
  opacity: 0.12;
  animation-delay: 6.6s;
}

.bg-glow-4 {
  width: 350px; height: 350px;
  top: 25%; left: 15%;
  background: radial-gradient(circle, rgba(168,130,220,0.3) 0%, transparent 70%);
  opacity: 0.1;
  animation-delay: 4s;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.08; transform: scale(1) rotate(0deg); }
  33% { opacity: 0.2; }
  66% { opacity: 0.1; }
  50% { transform: scale(1.2) rotate(3deg); }
}

/* Subtle grid */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
}

/* Particles */
.bg-particles {
  position: absolute;
  inset: 0;
}

.bg-particle {
  position: absolute;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 6px 1px rgba(255,255,255,0.2);
  animation: particleRise linear infinite;
}

@keyframes particleRise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  8% { opacity: 0.6; }
  92% { opacity: 0; }
  100% { transform: translateY(-80vh) scale(0.2); }
}

/* Floating diamond shapes */
.floating-shapes {
  position: absolute;
  inset: 0;
}

.float-diamond {
  position: absolute;
  animation: diamondFloat 12s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes diamondFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  25% { opacity: 0.7; }
  50% { transform: translateY(-30px) rotate(15deg); opacity: 0.3; }
  75% { opacity: 0.6; }
}

/* ==========================================
   PAGE HEADER
   ========================================== */
.page-header {
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, 
    rgba(20,10,35,0.97) 0%, 
    rgba(38,22,58,0.92) 35%, 
    rgba(28,40,58,0.7) 65%,
    rgba(20,16,36,0.3) 90%,
    transparent 100%
  );
  padding: 140px 0 90px;
  text-align: center;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(248,200,220,0.35), rgba(212,160,96,0.4), rgba(200,216,240,0.35), transparent);
}

.page-header::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: 
    radial-gradient(ellipse at 50% 30%, rgba(248,200,220,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 30% 70%, rgba(200,216,240,0.06) 0%, transparent 50%);
  pointer-events: none;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 22px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--accent-light);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 28px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 0.6rem;
  animation: spin 4s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.page-header h1 {
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8c8dc 45%, #c8d8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.page-header p {
  font-size: 1.15rem;
  color: rgba(255,255,255,0.45);
  font-weight: 400;
  letter-spacing: 0.06em;
}

.header-line {
  width: 100px;
  height: 2px;
  margin: 28px auto 0;
  background: linear-gradient(90deg, transparent, var(--accent-light), #f8c8dc, var(--accent-light), transparent);
  border-radius: 1px;
}

/* ==========================================
   CARDS AREA BACKGROUND
   ========================================== */
.characters-section {
  position: relative;
  z-index: 1;
  padding-top: 30px;
  padding-bottom: 80px;
}

.cards-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.cards-bg-aura {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.cards-bg-aura-1 {
  width: 500px; height: 500px;
  top: 10%; right: -100px;
  background: radial-gradient(circle, rgba(248,200,220,0.12) 0%, transparent 70%);
  animation: auraPulse 8s ease-in-out infinite;
}

.cards-bg-aura-2 {
  width: 400px; height: 400px;
  bottom: 5%; left: -80px;
  background: radial-gradient(circle, rgba(200,216,240,0.1) 0%, transparent 70%);
  animation: auraPulse 10s ease-in-out infinite 3s;
}

@keyframes auraPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.25); }
}

/* ==========================================
   FILTERS
   ========================================== */
.filters {
  position: relative;
  z-index: 1;
  margin-bottom: 48px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-end;
  background: rgba(30, 18, 50, 0.55);
  padding: 24px 32px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  letter-spacing: 0.03em;
}

.filter-group select {
  min-width: 200px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-group select:hover,
.filter-group select:focus {
  border-color: var(--accent-light);
  background: rgba(255,255,255,0.1);
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-filter {
  padding: 8px 20px;
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.55);
  font-size: 0.88rem;
  transition: all 0.3s ease;
  cursor: pointer;
  letter-spacing: 0.04em;
}

.tag-filter:hover {
  border-color: var(--accent-light);
  color: var(--accent-light);
  background: rgba(212,160,96,0.08);
  transform: translateY(-1px);
}

.tag-filter.active {
  background: linear-gradient(135deg, rgba(248,200,220,0.25), rgba(212,160,96,0.2));
  border-color: var(--accent-light);
  color: var(--accent-light);
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(212,160,96,0.15);
}

/* ==========================================
   EMPTY STATE
   ========================================== */
.empty-state {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 100px 20px;
  color: rgba(255,255,255,0.25);
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* ==========================================
   RESPONSIVE
   ========================================== */
@media (max-width: 768px) {
  .page-header {
    padding: 120px 0 60px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    padding: 20px;
  }

  .tag-filters { justify-content: center; }

  .bg-glow-1 { width: 350px; height: 350px; top: -120px; right: -100px; }
  .bg-glow-2 { width: 300px; height: 300px; bottom: -100px; left: -80px; }
  .bg-glow-3 { width: 250px; height: 250px; }
  .bg-glow-4 { width: 200px; height: 200px; }

  .cards-bg-aura-1 { width: 300px; height: 300px; }
  .cards-bg-aura-2 { width: 250px; height: 250px; }
}
</style>
