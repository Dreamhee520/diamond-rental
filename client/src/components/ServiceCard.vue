<template>
  <div class="service-card">
    <div class="service-icon-wrap">
      <div class="service-icon">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <defs>
            <linearGradient :id="'svcGrad' + title.length" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f8c8dc" />
              <stop offset="100%" style="stop-color:#d4a060" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="30" fill="none" :stroke="`url(#svcGrad${title.length})`" stroke-width="1.5" opacity="0.4"/>
          <circle cx="32" cy="32" r="24" fill="none" :stroke="`url(#svcGrad${title.length})`" stroke-width="1" opacity="0.2"/>
          <text x="32" y="40" text-anchor="middle" fill="var(--text-color)" font-size="26">{{ icon }}</text>
        </svg>
      </div>
    </div>
    <h3 class="service-title">{{ title }}</h3>
    <p class="service-desc">{{ description }}</p>
    <div class="service-price">
      <span class="price-label">基本料金</span>
      <span class="price-value">¥{{ price.toLocaleString() }}</span>
      <span class="price-unit">円/時間</span>
    </div>
    <div class="service-action">
      <span class="action-text">詳しく見る →</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '❤' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 10000 }
})
</script>

<style scoped>
.service-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-xl);
  padding: 44px 32px 36px;
  text-align: center;
  box-shadow: var(--card-shadow);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 20%; right: 20%;
  height: 3px;
  background: linear-gradient(90deg, #f8c8dc, #d4a060, #c8d8f0);
  border-radius: 0 0 3px 3px;
  opacity: 0;
  transition: var(--transition);
}

.service-card:hover::before { opacity: 1; }

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--card-shadow-hover);
  border-color: rgba(248,200,220,0.3);
}

.service-icon-wrap {
  margin-bottom: 24px;
}

.service-icon svg { transition: var(--transition); }

.service-card:hover .service-icon svg {
  transform: scale(1.08);
}

.service-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-color);
}

.service-desc {
  font-size: 0.95rem;
  color: var(--text-light);
  margin-bottom: 24px;
  line-height: 1.75;
}

.service-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 22px 0 18px;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.price-label {
  font-size: 0.8rem;
  color: var(--text-lighter);
  letter-spacing: 0.05em;
}

.price-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--accent);
}

.price-unit {
  font-size: 0.75rem;
  color: var(--text-lighter);
}

.service-action {
  margin-top: 18px;
}

.action-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-dark);
  transition: var(--transition-fast);
  opacity: 0;
  transform: translateY(5px);
}

.service-card:hover .action-text {
  opacity: 1;
  transform: translateY(0);
}
</style>
