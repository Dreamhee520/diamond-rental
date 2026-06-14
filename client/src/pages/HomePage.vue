<template>
  <div class="home-page">
    <HeroBanner />

    <!-- Featured Characters -->
    <section id="features" class="section section-featured">
      <!-- Background decorations -->
      <div class="featured-bg-deco">
        <div class="fg-glow fg-glow-1"></div>
        <div class="fg-glow fg-glow-2"></div>
        <div class="fg-glow fg-glow-3"></div>
        <!-- Floating diamonds -->
        <svg class="fg-diamond fg-diamond-1" viewBox="0 0 40 48" width="40" height="48">
          <path d="M20 2 L36 24 L20 46 L4 24 Z" fill="none" stroke="rgba(212,160,96,0.12)" stroke-width="1"/>
          <line x1="20" y1="2" x2="20" y2="24" stroke="rgba(212,160,96,0.07)" stroke-width="0.5"/>
          <line x1="4" y1="24" x2="20" y2="24" stroke="rgba(212,160,96,0.07)" stroke-width="0.5"/>
        </svg>
        <svg class="fg-diamond fg-diamond-2" viewBox="0 0 30 36" width="30" height="36">
          <path d="M15 1 L27 18 L15 35 L3 18 Z" fill="none" stroke="rgba(248,200,220,0.1)" stroke-width="1"/>
          <line x1="15" y1="1" x2="15" y2="18" stroke="rgba(248,200,220,0.06)" stroke-width="0.5"/>
        </svg>
        <svg class="fg-diamond fg-diamond-3" viewBox="0 0 36 44" width="36" height="44">
          <path d="M18 2 L32 22 L18 42 L4 22 Z" fill="none" stroke="rgba(180,200,240,0.1)" stroke-width="1"/>
          <line x1="18" y1="2" x2="18" y2="22" stroke="rgba(180,200,240,0.06)" stroke-width="0.5"/>
        </svg>
        <!-- Floating particles -->
        <div class="fg-particle fg-particle-1"></div>
        <div class="fg-particle fg-particle-2"></div>
        <div class="fg-particle fg-particle-3"></div>
        <div class="fg-particle fg-particle-4"></div>
        <div class="fg-particle fg-particle-5"></div>
        <div class="fg-particle fg-particle-6"></div>
      </div>

      <div class="container">
        <div class="section-title">
          <h2>✦ 精选角色 ✦</h2>
          <p>每一位角色都经过精心挑选，为您带来最温暖的陪伴</p>
        </div>

        <div class="grid grid-4" v-if="!loading">
          <CharacterCard
            v-for="(character, idx) in featuredCharacters"
            :key="character.id"
            :character="character"
            :style="{ animationDelay: (0.1 + idx * 0.08) + 's' }"
            class="featured-card"
            @click="goToCharacter"
            @book="goToBooking"
          />
        </div>

        <div class="loading-spinner" v-else>
          <div class="spinner"></div>
        </div>

        <div class="section-cta">
          <router-link to="/characters" class="btn btn-primary btn-lg">
            查看全部角色 ✦
          </router-link>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="section-divider">
      <span class="divider-icon">◆</span>
    </div>

    <!-- Services -->
    <section id="services" class="section section-alt">
      <div class="container">
        <div class="section-title">
          <h2>✦ 我们的服务 ✦</h2>
          <p>多样化的服务，满足您的不同需求</p>
        </div>

        <div class="grid grid-3" v-if="services.length">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :icon="service.icon"
            :title="service.name"
            :description="service.description"
            :price="service.base_price"
          />
        </div>

        <div class="section-cta">
          <router-link to="/services" class="btn btn-outline btn-lg">
            查看全部服务 →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="section-divider">
      <span class="divider-icon">◆</span>
    </div>

    <!-- Reviews -->
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>✦ 用户评价 ✦</h2>
          <p>听听他们怎么说</p>
        </div>

        <div class="grid grid-3">
          <ReviewCard
            v-for="review in reviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-bg">
        <div class="cta-glow cta-glow-1"></div>
        <div class="cta-glow cta-glow-2"></div>
      </div>
      <div class="container">
        <div class="cta-content">
          <h2>准备好开始了吗？</h2>
          <p>立即预约，开启温暖的陪伴之旅</p>
          <div class="cta-buttons">
            <router-link to="/characters" class="btn btn-primary btn-lg">
              ✦ 立即预约 ✦
            </router-link>
            <router-link to="/characters" class="btn btn-secondary btn-lg">
              浏览角色
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '../components/HeroBanner.vue'
import CharacterCard from '../components/CharacterCard.vue'
import ServiceCard from '../components/ServiceCard.vue'
import ReviewCard from '../components/ReviewCard.vue'
import api from '../services/api'
import { useAuth } from '../stores/auth'

const router = useRouter()

const loading = ref(false)
const featuredCharacters = ref([])
const services = ref([])
const reviews = ref([
  {
    id: 1,
    user_name: '田中さん',
    rating: 5,
    content: 'とても素敵な体験でした！千鶴さんは本当に優しくて、楽しい時間を過ごせました。また利用したいです。',
    character_name: '水原千鶴'
  },
  {
    id: 2,
    user_name: '佐藤さん',
    rating: 5,
    content: '仕事のストレスが溜まっていたので利用しました。麻美さんの癒し系の対応に本当に救われました。',
    character_name: '七海麻美'
  },
  {
    id: 3,
    user_name: '鈴木さん',
    rating: 4,
    content: '友達の紹介で初めて利用しました。最初は緊張しましたが、とても自然に会話できて楽しかったです！',
    character_name: '更科瑠夏'
  },
  {
    id: 4,
    user_name: '高橋さん',
    rating: 5,
    content: '凛さんと美術館デートしました。知的な会話がとても魅力的で、新しい発見がたくさんありました。',
    character_name: '皐月凛'
  },
  {
    id: 5,
    user_name: '山田さん',
    rating: 5,
    content: '初めての利用で不安でしたが、スタッフの対応も丁寧で安心できました。また機会があれば利用したいです。',
    character_name: '渚ことみ'
  },
  {
    id: 6,
    user_name: '伊藤さん',
    rating: 4,
    content: '芽衣ちゃんとカフェに行きました。可愛くて話しやすくて、あっという間に時間が過ぎました！',
    character_name: '芽衣'
  }
])

const goToCharacter = (id) => router.push(`/characters/${id}`)
const goToBooking = (id) => {
  const { state } = useAuth()
  if (!state.isAuthenticated) {
    router.push({ path: '/user', query: { redirect: `/booking/${id}` } })
    return
  }
  router.push(`/booking/${id}`)
}

onMounted(async () => {
  try {
    loading.value = true
    const res = await api.get('/characters', { params: { status: 'active', limit: 8 } })
    featuredCharacters.value = res.data || []

    const svcRes = await api.get('/services')
    services.value = svcRes.data || []
  } catch (err) {
    console.error('Failed to load homepage data:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Featured Section Decor ── */
.section-featured {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg,
    rgba(20,10,35,0.6) 0%,
    rgba(12,8,20,0.3) 40%,
    rgba(18,14,30,0.5) 100%
  );
}

.featured-bg-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* Glow orbs */
.fg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}

.fg-glow-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(248,200,220,0.6) 0%, transparent 70%);
  top: -150px;
  left: -120px;
  animation: glowBreathe 6s ease-in-out infinite;
}

.fg-glow-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(212,160,96,0.5) 0%, transparent 70%);
  bottom: -80px;
  right: -100px;
  animation: glowBreathe 7s ease-in-out infinite reverse;
}

.fg-glow-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(180,200,240,0.4) 0%, transparent 70%);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: glowBreathe 8s ease-in-out infinite 2s;
}

@keyframes glowBreathe {
  0%, 100% { opacity: 0.12; transform: scale(1) translate(0, 0); }
  50%      { opacity: 0.22; transform: scale(1.15) translate(0, -10px); }
}

/* Floating diamonds */
.fg-diamond {
  position: absolute;
  animation: diamondFloat 12s ease-in-out infinite;
}
.fg-diamond-1 {
  top: 12%;
  left: 8%;
  animation-delay: 0s;
}
.fg-diamond-2 {
  top: 65%;
  right: 6%;
  animation-delay: -4s;
  animation-duration: 14s;
}
.fg-diamond-3 {
  top: 35%;
  left: 85%;
  animation-delay: -8s;
  animation-duration: 16s;
}

@keyframes diamondFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
  25%      { transform: translateY(-20px) rotate(5deg); opacity: 0.8; }
  50%      { transform: translateY(-10px) rotate(0deg); opacity: 0.4; }
  75%      { transform: translateY(-25px) rotate(-5deg); opacity: 0.7; }
}

/* Floating particles */
.fg-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(212,160,96,0.6);
  box-shadow: 0 0 8px rgba(212,160,96,0.3);
  animation: particleRise 8s ease-in-out infinite;
}
.fg-particle-1 { top: 70%; left: 10%; animation-delay: 0s; background: rgba(248,200,220,0.6); box-shadow: 0 0 8px rgba(248,200,220,0.3); }
.fg-particle-2 { top: 55%; left: 25%; animation-delay: -2s; animation-duration: 10s; }
.fg-particle-3 { top: 80%; left: 45%; animation-delay: -4s; background: rgba(180,200,240,0.6); box-shadow: 0 0 8px rgba(180,200,240,0.3); }
.fg-particle-4 { top: 60%; left: 65%; animation-delay: -6s; animation-duration: 9s; }
.fg-particle-5 { top: 75%; left: 80%; animation-delay: -3s; background: rgba(248,200,220,0.6); box-shadow: 0 0 8px rgba(248,200,220,0.3); }
.fg-particle-6 { top: 50%; left: 92%; animation-delay: -5s; animation-duration: 11s; }

@keyframes particleRise {
  0%   { transform: translateY(0) scale(1); opacity: 0.3; }
  50%  { transform: translateY(-60px) scale(1.8); opacity: 0.9; }
  100% { transform: translateY(-120px) scale(0.6); opacity: 0; }
}

/* Cards get relative z-index to sit above decorations */
.featured-card {
  position: relative;
  z-index: 1;
}

/* Section title & cta also above */
.section-featured .section-title,
.section-featured .section-cta {
  position: relative;
  z-index: 1;
}

.section-alt {
  background: linear-gradient(180deg, rgba(248,200,220,0.03) 0%, rgba(200,216,240,0.03) 100%);
}

.section-divider {
  display: flex;
  justify-content: center;
  padding: 0;
  margin-top: -20px;
  position: relative;
  z-index: 1;
}

.divider-icon {
  font-size: 1.5rem;
  color: rgba(212, 160, 96, 0.4);
  animation: spin 8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* CTA Section */
.cta-section {
  position: relative;
  padding: 120px 0;
  overflow: hidden;
  background: linear-gradient(160deg, #1a1028 0%, #2a1a3e 50%, #1a2838 100%);
}

.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cta-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.cta-glow-1 {
  width: 400px;
  height: 400px;
  background: rgba(248,200,220,0.1);
  top: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.cta-glow-2 {
  width: 350px;
  height: 350px;
  background: rgba(200,216,240,0.1);
  bottom: -80px;
  right: -80px;
  animation: float 10s ease-in-out infinite reverse;
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  color: #fff;
  margin-bottom: 16px;
  font-weight: 800;
}

.cta-content p {
  font-size: 1.15rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 40px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
