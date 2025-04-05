<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed, watch, onMounted } from 'vue'
import { useSettingsStore } from './stores/settings'
import { useRouter, useRoute } from 'vue-router'

const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

// 判断当前是否为登录页面
const isLoginPage = computed(() => {
  return route.name === 'login'
})

// 获取当前主题
const currentTheme = computed(() => settingsStore.getTheme)

// 监听主题变化，应用主题样式
watch(() => currentTheme.value, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
}, { immediate: true })

// 导航菜单
const navItems = [
  { path: '/', name: '仪表盘', icon: 'dashboard' },
  { path: '/transactions', name: '收支记录', icon: 'transaction' },
  { path: '/budget', name: '预算管理', icon: 'budget' },
  { path: '/analysis', name: '财务分析', icon: 'analysis' },
  { path: '/settings', name: '设置', icon: 'settings' }
]

onMounted(() => {
  // 检查浏览器是否有保存的token
  const token = localStorage.getItem('token')
  
  // 检查token是否有效 (简单检查格式)
  if (token) {
    try {
      const isValidFormat = typeof token === 'string' && token.split('.').length === 3
      
      if (!isValidFormat) {
        console.log('检测到无效的token格式，清除并重定向到登录页')
        localStorage.removeItem('token')
        if (router.currentRoute.value.meta.requiresAuth) {
          router.push('/login')
        }
      }
    } catch (e) {
      console.error('Token验证错误:', e)
      localStorage.removeItem('token')
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    }
  }
})
</script>

<template>
  <div class="app" :class="[currentTheme, { 'login-page': isLoginPage }]">
    <!-- 在非登录页面显示侧边栏 -->
    <aside class="sidebar" v-if="!isLoginPage">
      <div class="brand">
        <h1>个人财务管理</h1>
      </div>
      
      <nav class="nav-menu">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <span class="nav-icon" :class="`icon-${item.icon}`"></span>
          <span class="nav-text">{{ item.name }}</span>
        </RouterLink>
      </nav>
      
      <div class="user-info">
        <div class="avatar">{{ settingsStore.getUserName.slice(0, 1) }}</div>
        <div class="username">{{ settingsStore.getUserName }}</div>
      </div>
    </aside>
    
    <!-- 主内容 -->
    <main class="main-content" :class="{ 'full-width': isLoginPage }">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --heading-color: #222;
  --text-color: #333;
  --text-color-secondary: #666;
  --disabled-color: #bfbfbf;
  --border-color: #f0f0f0;
  --background-color: #f5f5f5;
  --component-background: #fff;
  --sidebar-background: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.65);
  --sidebar-active-text-color: #fff;
}

html[data-theme='dark'] {
  --heading-color: #fff;
  --text-color: rgba(255, 255, 255, 0.85);
  --text-color-secondary: rgba(255, 255, 255, 0.45);
  --disabled-color: rgba(255, 255, 255, 0.3);
  --border-color: #303030;
  --background-color: #141414;
  --component-background: #1f1f1f;
  --sidebar-background: #141414;
  --sidebar-text-color: rgba(255, 255, 255, 0.45);
  --sidebar-active-text-color: #1890ff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  font-size: 14px;
  line-height: 1.5;
}

/* 图标样式 */
.nav-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.active .nav-icon {
  opacity: 1;
}

.icon-dashboard::before {
  content: "📊";
}

.icon-transaction::before {
  content: "💰";
}

.icon-budget::before {
  content: "📝";
}

.icon-analysis::before {
  content: "📈";
}

.icon-settings::before {
  content: "⚙️";
}
</style>

<style scoped>
.app {
  width: 100%;
  display: flex;
  min-height: 100vh;
}

/* 登录页样式 */
.login-page {
  background-color: var(--background-color);
}

.sidebar {
  width: 220px;
  background-color: var(--sidebar-background);
  color: var(--sidebar-text-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 10;
}

.brand {
  padding: 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.brand h1 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.nav-menu {
  padding: 16px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  color: var(--sidebar-text-color);
  text-decoration: none;
  position: relative;
  transition: all 0.3s;
}

.nav-item:hover {
  color: var(--sidebar-active-text-color);
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: var(--sidebar-active-text-color);
  background-color: var(--primary-color);
}

.user-info {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 10px;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 30px 40px;
  background-color: var(--background-color);
  min-height: 100vh;
  width: calc(100% - 220px);
  box-sizing: border-box;
}

/* 登录页面全宽内容 */
.main-content.full-width {
  margin-left: 0;
  width: 100%;
  padding: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }
  
  .brand h1 {
    display: none;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-icon {
    margin-right: 0;
  }
  
  .nav-item {
    justify-content: center;
  }
  
  .username {
    display: none;
  }
  
  .user-info {
    justify-content: center;
  }
  
  .main-content:not(.full-width) {
    margin-left: 80px;
    width: calc(100% - 80px);
    padding: 20px;
  }
}
</style>
