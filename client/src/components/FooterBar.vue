<template>
  <footer class="footer">
    <div class="footer-top-decor"></div>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section footer-brand">
          <div class="footer-logo">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <defs>
                <linearGradient id="ftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#f8c8dc" />
                  <stop offset="50%" style="stop-color:#d4a060" />
                  <stop offset="100%" style="stop-color:#c8d8f0" />
                </linearGradient>
              </defs>
              <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="url(#ftGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
              <text x="20" y="24" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">D</text>
            </svg>
            <span class="brand-name">Diamond</span>
          </div>
          <p class="footer-desc">温暖的陪伴，从这里开始。我们致力于为每一位客户带来最真挚的温暖与关怀。</p>
          <div class="footer-social">
            <span class="social-dot"></span>
            <span class="social-dot"></span>
            <span class="social-dot"></span>
            <span class="social-dot"></span>
          </div>
        </div>

        <div class="footer-section">
          <h4>快速链接</h4>
          <router-link to="/">首页</router-link>
          <router-link to="/characters">角色列表</router-link>
          <router-link to="/services">服务介绍</router-link>
          <router-link to="/user">用户中心</router-link>
        </div>

        <div class="footer-section">
          <h4>服务类别</h4>
          <a href="#">デートコース</a>
          <a href="#">お話し相手</a>
          <a href="#">イベント同伴</a>
          <a href="#">観光案内</a>
        </div>

        <div class="footer-section">
          <h4>联系我们</h4>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>contact@diamond-rental.jp</span>
          </div>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            <span>03-1234-5678</span>
          </div>
          <div class="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>東京都渋谷区神宮前 1-2-3</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-line"></div>
        <p>&copy; 2026 Diamond ダイヤモンドレンタル事務所. All rights reserved.</p>
        <p class="footer-hearts">◆ ♥ ✦ ♥ ◆</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #1a1028 0%, #120820 100%);
  color: rgba(255,255,255,0.8);
  padding: 0 0 30px;
  margin-top: auto;
  position: relative;
}

.footer-top-decor {
  height: 3px;
  background: linear-gradient(90deg, transparent, #f8c8dc, #d4a060, #c8d8f0, transparent);
  opacity: 0.6;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 50px;
  padding: 60px 0 40px;
}

.footer-section h4 {
  color: #fff;
  margin-bottom: 22px;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.footer-section a {
  display: block;
  color: rgba(255,255,255,0.55);
  margin-bottom: 12px;
  transition: var(--transition-fast);
  font-size: 0.95rem;
  padding: 2px 0;
}

.footer-section a:hover {
  color: var(--primary);
  transform: translateX(6px);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.brand-name {
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f8c8dc, #d4a060);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.04em;
}

.footer-desc {
  color: rgba(255,255,255,0.45);
  line-height: 1.9;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.footer-social {
  display: flex;
  gap: 10px;
}

.social-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: var(--transition-fast);
}

.social-dot:nth-child(1):hover { background: #f8c8dc; }
.social-dot:nth-child(2):hover { background: #d4a060; }
.social-dot:nth-child(3):hover { background: #c8d8f0; }
.social-dot:nth-child(4):hover { background: #f8c8dc; }

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
}

.contact-item svg { flex-shrink: 0; opacity: 0.5; }

.footer-bottom {
  text-align: center;
  padding-top: 30px;
}

.footer-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  margin-bottom: 30px;
}

.footer-bottom p {
  color: rgba(255,255,255,0.3);
  font-size: 0.85rem;
}

.footer-hearts {
  margin-top: 12px;
  font-size: 1.1rem;
  letter-spacing: 8px;
  background: linear-gradient(90deg, #f8c8dc, #d4a060, #c8d8f0, #d4a060, #f8c8dc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 35px;
  }
}
</style>
