import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useSettingsStore } from '../stores/settings'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录', requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '仪表盘', requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: { title: '收支记录', requiresAuth: true }
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('../views/BudgetView.vue'),
      meta: { title: '预算管理', requiresAuth: true }
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/AnalysisView.vue'),
      meta: { title: '财务分析', requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: '设置', requiresAuth: true }
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '财务管理'} - 个人财务管理系统`
  
  // 检查是否需要登录验证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // 从localStorage获取token
  const token = localStorage.getItem('token')
  
  if (requiresAuth && !token) {
    // 如果需要登录但没有token，重定向到登录页面
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    // 如果已经登录但尝试访问登录页面，重定向到首页
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
