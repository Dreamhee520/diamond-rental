<template>
  <section class="hero-banner">
    <!-- Background layers -->
    <div class="hero-bg">
      <div class="hero-gradient"></div>
      <div class="hero-particles">
        <div class="particle" v-for="n in 20" :key="n" :style="particleStyle(n)"></div>
      </div>
      <div class="hero-ring hero-ring-1"></div>
      <div class="hero-ring hero-ring-2"></div>
      <div class="hero-ring hero-ring-3"></div>
    </div>

    <div class="container hero-content">
      <div class="hero-text">
        <div class="hero-badge">
          <span class="badge-diamond">◆</span>
          プレミアムレンタル
        </div>
        <h1 class="hero-title">
          <span class="title-line title-en">Diamond</span>
          <span class="title-line title-jp">ダイヤモンド</span>
          <span class="title-line title-cn">钻石租借事务所</span>
        </h1>
        <p class="hero-tagline">あなたの心に、きらめくひとときを</p>
        <p class="hero-desc">
          在这里，每一位角色都会用心倾听您的故事，给予最真挚的陪伴与关怀。
          让我们一起创造美好的回忆吧！
        </p>
        <div class="hero-buttons">
          <router-link to="/characters" class="btn btn-primary btn-lg">
            <span class="btn-shine">✦</span>
            开始预约
          </router-link>
          <a href="#features" class="btn btn-secondary btn-lg">
            了解更多
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
          </a>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">精選角色</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">99<span class="stat-percent">%</span></span>
            <span class="stat-label">満足度</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">24<span class="stat-unit">h</span></span>
            <span class="stat-label">年中無休</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="diamond-container">
          <div class="diamond-glow"></div>
          <svg viewBox="0 0 240 240" width="240" height="240" class="diamond-svg">
            <defs>
              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fce4ec;stop-opacity:1" />
                <stop offset="30%" style="stop-color:#f8c8dc;stop-opacity:1" />
                <stop offset="60%" style="stop-color:#d4a060;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#c8d8f0;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="diamondShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#fff;stop-opacity:0.5" />
                <stop offset="100%" style="stop-color:#fff;stop-opacity:0" />
              </linearGradient>
              <filter id="diamondShadow">
                <feDropShadow dx="0" dy="8" stdDeviation="20" flood-color="#d4a060" flood-opacity="0.3"/>
              </filter>
            </defs>
            <!-- Main shape -->
            <path d="M120 12 L218 90 L120 228 L22 90 Z" fill="url(#diamondGrad)" filter="url(#diamondShadow)"/>
            <!-- Top crown facet (lighter) -->
            <path d="M120 12 L218 90 L120 120 Z" fill="url(#diamondShine)"/>
            <!-- Bottom pavilion facet (darker) -->
            <path d="M22 90 L120 120 L120 228 Z" fill="rgba(0,0,0,0.06)"/>
            <path d="M120 120 L218 90 L120 228 Z" fill="rgba(0,0,0,0.04)"/>
            <!-- Facet lines - crown -->
            <line x1="120" y1="12" x2="120" y2="120" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/>
            <line x1="120" y1="12" x2="70" y2="90" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
            <line x1="120" y1="12" x2="170" y2="90" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
            <!-- Facet lines - pavilion -->
            <line x1="120" y1="120" x2="120" y2="228" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
            <line x1="22" y1="90" x2="120" y2="168" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
            <line x1="218" y1="90" x2="120" y2="168" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
            <line x1="22" y1="90" x2="218" y2="90" stroke="rgba(255,255,255,0.18)" stroke-width="0.8"/>
            <!-- Center sparkle -->
            <circle cx="120" cy="120" r="3" fill="#fff" opacity="0.9"/>
            <circle cx="120" cy="120" r="8" fill="none" stroke="#fff" stroke-width="0.3" opacity="0.4"/>
            <!-- Star sparkle lines -->
            <line x1="110" y1="120" x2="98" y2="120" stroke="#fff" stroke-width="0.8" opacity="0.5"/>
            <line x1="130" y1="120" x2="142" y2="120" stroke="#fff" stroke-width="0.8" opacity="0.5"/>
            <line x1="120" y1="110" x2="120" y2="98" stroke="#fff" stroke-width="0.8" opacity="0.5"/>
            <line x1="120" y1="130" x2="120" y2="142" stroke="#fff" stroke-width="0.8" opacity="0.5"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="hero-scroll">
      <span>SCROLL</span>
      <svg width="20" height="30" viewBox="0 0 20 30"><rect x="3" y="3" width="14" height="24" rx="7" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2" fill="currentColor" class="scroll-dot"/></svg>
    </div>
  </section>
</template>

<script setup>
const particleStyle = (n) => {
  const left = ((n * 37 + 13) % 100)
  const top = ((n * 53 + 7) % 100)
  const size = 2 + (n % 4)
  const delay = (n * 0.7) % 5
  const duration = 6 + (n % 6)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.3 + (n % 5) * 0.1
  }
}
</script>

<style scoped>
.hero-banner {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(160deg, #1a1028 0%, #2a1a3e 30%, #1e2a3e 60%, #1a2838 100%);
  overflow: hidden;
  padding-top: 80px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(248, 200, 220, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(200, 216, 240, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(212, 160, 96, 0.08) 0%, transparent 60%);
}

/* Floating particles */
.hero-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0; }
  100% { transform: translateY(-100vh) scale(0); }
}

/* Decorative rings */
.hero-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.06);
}

.hero-ring-1 {
  width: 600px; height: 600px;
  top: -200px; right: -200px;
  animation: ringPulse 8s ease-in-out infinite;
}

.hero-ring-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -100px;
  animation: ringPulse 10s ease-in-out infinite 2s;
  border-color: rgba(255,255,255,0.04);
}

.hero-ring-3 {
  width: 300px; height: 300px;
  top: 40%; left: 60%;
  animation: ringPulse 7s ease-in-out infinite 1s;
  border-color: rgba(248,200,220,0.1);
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 1; }
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  animation: slideUp 0.8s ease both;
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  border-radius: 20px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--accent-light);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-bottom: 30px;
}

.badge-diamond { font-size: 0.7rem; }

.hero-title {
  margin-bottom: 24px;
}

.title-line {
  display: block;
  font-weight: 800;
  line-height: 1.15;
}

.title-en {
  font-size: clamp(3rem, 7vw, 5rem);
  color: #fff;
  letter-spacing: 0.05em;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.title-jp {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  color: var(--accent-light);
  letter-spacing: 0.12em;
  font-weight: 400;
  margin-top: 4px;
}

.title-cn {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  background: linear-gradient(135deg, #f8c8dc 0%, #d4a060 50%, #c8d8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 8px;
}

.hero-tagline {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255,255,255,0.5);
  margin-bottom: 16px;
  font-weight: 400;
  letter-spacing: 0.08em;
  font-style: italic;
}

.hero-desc {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.45);
  margin-bottom: 36px;
  line-height: 1.9;
  max-width: 460px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.btn-shine {
  display: inline-block;
  animation: spin 3s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.stat-percent {
  font-size: 1rem;
  color: var(--accent-light);
}

.stat-unit {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.4);
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  margin-top: 4px;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.1);
}

/* Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease 0.3s both;
}

.diamond-container {
  position: relative;
}

.diamond-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,160,96,0.2) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}

.diamond-svg {
  position: relative;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

/* Scroll indicator */
.hero-scroll {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.25);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  animation: fadeIn 1s ease 1s both;
}

.scroll-dot {
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 50px;
  }

  .hero-visual { order: -1; }

  .diamond-svg { width: 160px; height: 160px; }

  .diamond-container svg { width: 160px; height: 160px; }

  .hero-desc { max-width: 100%; }

  .hero-stats { justify-content: center; }

  .hero-buttons { justify-content: center; }
}
</style>
