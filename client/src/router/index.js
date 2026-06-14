import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/HomePage.vue'),
    meta: { title: '首页 - Diamond 钻石租借事务所' }
  },
  {
    path: '/characters',
    name: 'Characters',
    component: () => import('../pages/CharactersPage.vue'),
    meta: { title: '角色列表 - Diamond 钻石租借事务所' }
  },
  {
    path: '/characters/:id',
    name: 'CharacterDetail',
    component: () => import('../pages/CharacterDetail.vue'),
    meta: { title: '角色详情 - Diamond 钻石租借事务所' }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../pages/ServicesPage.vue'),
    meta: { title: '服务介绍 - Diamond 钻石租借事务所' }
  },
  {
    path: '/booking/:characterId',
    name: 'Booking',
    component: () => import('../pages/BookingPage.vue'),
    meta: { title: '预约 - Diamond 钻石租借事务所' }
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('../pages/UserCenter.vue'),
    meta: { title: '用户中心 - Diamond 钻石租借事务所' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/AdminDashboard.vue'),
    meta: { title: '管理后台 - Diamond 钻石租借事务所', requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta.title || 'Diamond 钻石租借事务所'

  // Check for authentication
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'UserCenter', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && user && user.role !== 'admin') {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
