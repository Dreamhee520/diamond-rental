<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container navbar-content">
      <router-link to="/" class="navbar-logo">
        <svg class="logo-icon" viewBox="0 0 40 40" width="40" height="40">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f8c8dc;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#d4a060;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#c8d8f0;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="url(#logoGrad)" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
          <text x="20" y="24" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">D</text>
        </svg>
        <span class="logo-text">Diamond</span>
      </router-link>

      <button class="navbar-toggle" @click="isMenuOpen = !isMenuOpen" :class="{ active: isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="navbar-menu" :class="{ active: isMenuOpen }">
        <router-link to="/" class="nav-link" @click="closeMenu">首页</router-link>
        <router-link to="/characters" class="nav-link" @click="closeMenu">角色</router-link>
        <router-link to="/services" class="nav-link" @click="closeMenu">服务</router-link>

        <template v-if="!state.isAuthenticated">
          <router-link to="/user" class="nav-link nav-link-btn" @click="closeMenu">登录</router-link>
        </template>
        <template v-else>
          <router-link to="/user" class="nav-link nav-user" @click="closeMenu">
            <span class="user-avatar">{{ state.user?.username?.[0]?.toUpperCase() }}</span>
            <span>{{ state.user?.username }}</span>
          </router-link>
          <button class="nav-link logout-btn" @click="handleLogout">退出</button>
        </template>

        <template v-if="isAdmin">
          <router-link to="/admin" class="nav-link nav-admin" @click="closeMenu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            管理
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { state, logout, isAdmin } = useAuth()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
const closeMenu = () => { isMenuOpen.value = false }

const handleLogout = () => {
  logout()
  closeMenu()
  router.push('/')
}

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(26, 16, 40, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: all 0.4s ease;
  padding: 16px 0;
}

.navbar-scrolled {
  background: rgba(26, 16, 40, 0.95);
  box-shadow: 0 4px 30px rgba(0,0,0,0.2);
  padding: 10px 0;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.logo-icon { transition: transform 0.4s ease; }

.navbar-logo:hover .logo-icon { transform: rotate(20deg) scale(1.05); }

.logo-text {
  background: linear-gradient(135deg, #f8c8dc, #d4a060, #c8d8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: 6px;
}

.navbar-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: rgba(255,255,255,0.7);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.navbar-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.navbar-toggle.active span:nth-child(2) { opacity: 0; }
.navbar-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  padding: 8px 18px;
  border-radius: var(--border-radius-sm);
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition-fast);
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.06);
}

.nav-link.router-link-active {
  color: #fff;
  background: rgba(248,200,220,0.12);
}

.nav-link-btn {
  background: linear-gradient(135deg, rgba(248,200,220,0.2), rgba(212,160,96,0.2));
  border: 1px solid rgba(248,200,220,0.3);
  color: #fff;
}

.nav-link-btn:hover {
  background: linear-gradient(135deg, rgba(248,200,220,0.35), rgba(212,160,96,0.35));
  border-color: rgba(248,200,220,0.5);
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8c8dc, #d4a060);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}

.logout-btn {
  background: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
}

.logout-btn:hover { color: #e74c3c; background: rgba(231,76,60,0.1); }

.nav-admin {
  background: rgba(212,160,96,0.15);
  border: 1px solid rgba(212,160,96,0.25);
  color: var(--accent-light);
}

.nav-admin:hover {
  background: rgba(212,160,96,0.25);
  border-color: rgba(212,160,96,0.4);
}

@media (max-width: 768px) {
  .navbar-toggle { display: flex; }

  .navbar-menu {
    position: fixed;
    top: 72px;
    left: 0; right: 0;
    background: rgba(26, 16, 40, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 24px 20px;
    gap: 4px;
    transform: translateY(-10px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    width: 100%;
    padding: 12px 18px;
  }
}
</style>
