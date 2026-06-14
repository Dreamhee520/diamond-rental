<template>
  <div class="services-page">
    <section class="page-header">
      <div class="container">
        <div class="header-deco">
          <span class="deco-sparkle">✦</span>
          <h1>我们的服务</h1>
          <span class="deco-sparkle">✦</span>
        </div>
        <p>专业、温暖、贴心的租借陪伴服务体系</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>服务项目</h2>
          <p>多样化的服务场景，满足您的不同需求</p>
        </div>

        <div class="services-grid">
          <div class="service-big-card" v-for="service in services" :key="service.id">
            <div class="service-icon-wrap">
              <span class="service-icon">{{ service.icon }}</span>
            </div>
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p class="service-desc">{{ service.description }}</p>
              <div class="service-meta">
                <span class="service-price">¥{{ service.base_price.toLocaleString() }}円</span>
                <span class="service-unit">/ {{ service.duration || '次' }}</span>
              </div>
              <ul class="service-features">
                <li v-for="feat in (service.features || [])" :key="feat">✦ {{ feat }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section rules-section">
      <div class="container">
        <div class="section-title">
          <h2>服务须知</h2>
          <p>请在预约前仔细阅读以下规则</p>
        </div>

        <div class="rules-grid">
          <div class="rule-card" v-for="rule in rules" :key="rule.title">
            <div class="rule-icon">{{ rule.icon }}</div>
            <h3>{{ rule.title }}</h3>
            <p>{{ rule.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section flow-section">
      <div class="container">
        <div class="section-title">
          <h2>服务流程</h2>
          <p>简单4步，开启温暖陪伴之旅</p>
        </div>

        <div class="flow-steps">
          <div class="flow-step" v-for="(step, idx) in flowSteps" :key="idx">
            <div class="step-number">{{ idx + 1 }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section pricing-section">
      <div class="container">
        <div class="section-title">
          <h2>料金ルール</h2>
          <p>透明定价，无隐藏消费</p>
        </div>

        <div class="pricing-table">
          <div class="pricing-row header-row">
            <span>服务项目</span>
            <span>基本料金</span>
            <span>说明</span>
          </div>
          <div class="pricing-row" v-for="item in pricingItems" :key="item.name">
            <span class="pricing-name">{{ item.name }}</span>
            <span class="pricing-price">¥{{ item.price.toLocaleString() }}円</span>
            <span class="pricing-note">{{ item.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section cta-section">
      <div class="container">
        <div class="cta-box">
          <h2>心动了吗？立即开始吧</h2>
          <p>选择你喜欢的角色，体验温暖的陪伴</p>
          <router-link to="/characters" class="btn btn-primary btn-lg">
            浏览角色 ✦
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const services = ref([
  {
    id: 1,
    name: '陪伴约会',
    icon: '💑',
    description: '和你心仪的角色一同度过专属的约会时光。无论是公园漫步、下午茶还是夜晚散步，她会全程专注陪伴，给你最温馨的体验。',
    base_price: 3000,
    duration: '次',
    features: ['全程陪同，不分心', '约会路线可提前商议', '适合各类户外场景', '完全私密，无第三方打扰']
  },
  {
    id: 2,
    name: '逛街购物',
    icon: '🛍',
    description: '带她一起去购物，享受逛街的乐趣。她会给你搭配建议，陪你选购，让购物体验更加愉快有趣。',
    base_price: 2500,
    duration: '次',
    features: ['穿搭建议专业', '陪逛3-5小时', '可协助拿包', '商场/超市/街区均可']
  },
  {
    id: 3,
    name: '看电影',
    icon: '🎬',
    description: '两个人的电影更有味道。她会和你一起选片、买爆米花，在黑暗的影厅里给你温暖的陪伴。',
    base_price: 2000,
    duration: '次',
    features: ['电影票自理', '可一起选片', '含观影前后闲聊', '最长持续3小时']
  },
  {
    id: 4,
    name: '谈心陪伴',
    icon: '☕',
    description: '有时候只需要一个人倾听。她会认真倾听你的烦恼，给你温暖的回应，像老朋友一样聊天。适合情绪低落或需要倾诉的时候。',
    base_price: 3500,
    duration: '次',
    features: ['专注倾听，不评判', '可以在咖啡厅等地', '提供情绪支持', '最长2-3小时']
  },
  {
    id: 5,
    name: '节日陪同',
    icon: '🎉',
    description: '生日、情人节、圣诞节……特别的日子需要特别的陪伴。她会精心为你准备节日惊喜，让节日不再孤单。',
    base_price: 5000,
    duration: '次',
    features: ['包含节日策划建议', '可安排特别环节', '全天候陪同', '含基础礼物制作']
  },
  {
    id: 6,
    name: '日常陪伴',
    icon: '🌸',
    description: '不需要特定场合，就只是想有人陪在身边。一起宅在家、一起学习、一起吃饭，感受平凡日子的温度。',
    base_price: 4000,
    duration: '天',
    features: ['按天计费', '场景灵活自由', '居家/图书馆均可', '适合长期订阅']
  }
])

const rules = ref([
  {
    icon: '⏰',
    title: '提前预约',
    content: '请至少提前2小时完成预约。节假日及热门时段建议提前1-3天预约，以保证档期可用。'
  },
  {
    icon: '📍',
    title: '服务地点',
    content: '所有服务均在公共场所进行，包括咖啡厅、商场、公园、影院等。确保安全的公开环境。'
  },
  {
    icon: '💬',
    title: '礼貌尊重',
    content: '请保持礼貌尊重的交流态度。我们的角色有权拒绝任何不适当的要求，请尊重其个人边界。'
  },
  {
    icon: '❌',
    title: '取消规则',
    content: '预约确认后，如需取消，请提前1小时通知。超时取消将不退款。连续爽约3次将暂停账户。'
  },
  {
    icon: '🔒',
    title: '隐私保护',
    content: '您的个人信息将严格保密，不会泄露给第三方。角色信息同样受到保护，请勿公开分享。'
  },
  {
    icon: '💰',
    title: '费用说明',
    content: '所有价格为税后最终价格。特殊场景（如远途出行）可能产生额外交通费，提前说明。'
  }
])

const flowSteps = ref([
  { icon: '👤', title: '选择角色', desc: '浏览角色图鉴，找到心仪的那一位' },
  { icon: '📅', title: '选择时间', desc: '选择合适的日期和时间段提交预约' },
  { icon: '✅', title: '等待确认', desc: '事务所将在1小时内确认您的预约' },
  { icon: '🌸', title: '开始体验', desc: '按约定时间地点，开始温暖的陪伴' }
])

const pricingItems = ref([
  { name: '陪伴约会', price: '3,000', note: '2小时起，超时¥500/小时' },
  { name: '逛街购物', price: '2,500', note: '4小时，含基础场景' },
  { name: '看电影', price: '2,000', note: '1场次，电影票另算' },
  { name: '谈心陪伴', price: '3,500', note: '2小时，超时¥800/小时' },
  { name: '节日陪同', price: '5,000', note: '全天（8小时），含策划' },
  { name: '日常陪伴', price: '4,000', note: '按天计算，8小时' }
])

onMounted(async () => {
  try {
    const res = await api.get('/services')
    if (res.data && res.data.length > 0) {
      // Use API data if available, keep local features
      res.data.forEach(apiService => {
        const idx = services.value.findIndex(s => s.name === apiService.name)
        if (idx !== -1) {
          services.value[idx] = { ...services.value[idx], ...apiService }
        }
      })
    }
  } catch (e) {
    console.log('Using local service data')
  }
})
</script>

<style scoped>
.page-header {
  background: var(--bg-gradient);
  padding: 120px 0 60px;
  text-align: center;
}

.header-deco {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.header-deco h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--text-color);
}

.deco-sparkle {
  font-size: 1.5rem;
  color: var(--primary-dark);
  animation: sparkle 3s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(30deg); }
}

.page-header p {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.8;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}

.service-big-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 35px;
  box-shadow: var(--card-shadow);
  display: flex;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-big-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--card-shadow-hover);
}

.service-icon-wrap {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.service-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.service-desc {
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 15px;
}

.service-meta {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 15px;
}

.service-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent);
}

.service-unit {
  font-size: 0.9rem;
  color: var(--text-light);
}

.service-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.service-features li {
  font-size: 0.85rem;
  color: var(--text-light);
}

.rules-section {
  background: var(--bg-color);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.rule-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.rule-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
}

.rule-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.rule-card h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.rule-card p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.7;
}

.flow-section {
  background: rgba(30, 20, 45, 0.4);
  backdrop-filter: blur(12px);
}

.flow-steps {
  display: flex;
  gap: 0;
  position: relative;
  overflow-x: auto;
}

.flow-steps::before {
  content: '';
  position: absolute;
  top: 45px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  z-index: 0;
}

.flow-step {
  flex: 1;
  min-width: 150px;
  text-align: center;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-gradient);
  color: var(--text-color);
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  position: relative;
  box-shadow: 0 4px 15px rgba(248, 200, 220, 0.4);
}

.step-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.flow-step h4 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.flow-step p {
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.5;
}

.pricing-section {
  background: var(--bg-color);
}

.pricing-table {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.pricing-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: 18px 30px;
  border-bottom: 1px solid var(--border-color);
  gap: 20px;
  align-items: center;
  transition: background 0.2s ease;
}

.pricing-row:hover:not(.header-row) {
  background: var(--bg-color);
}

.pricing-row.header-row {
  background: var(--bg-gradient);
  font-weight: 700;
  font-size: 1rem;
}

.pricing-name {
  font-weight: 500;
}

.pricing-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
}

.pricing-note {
  font-size: 0.9rem;
  color: var(--text-light);
}

.cta-section {
  background: var(--bg-gradient);
}

.cta-box {
  text-align: center;
  padding: 60px 20px;
}

.cta-box h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  margin-bottom: 15px;
}

.cta-box p {
  font-size: 1.15rem;
  margin-bottom: 30px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-big-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .flow-steps::before {
    display: none;
  }

  .flow-steps {
    flex-direction: column;
  }

  .pricing-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .pricing-row.header-row {
    display: none;
  }
}
</style>
