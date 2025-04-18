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

// 判断当前激活的导航项
const currentRouteName = computed(() => route.name)

// 监听主题变化，应用主题样式
watch(() => currentTheme.value, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
}, { immediate: true })

// 导航菜单
const navItems = [
  { path: '/', name: 'home', label: '仪表盘', icon: 'dashboard' },
  { path: '/transactions', name: 'transactions', label: '收支记录', icon: 'transaction' },
  { path: '/budget', name: 'budget', label: '预算管理', icon: 'budget' },
  { path: '/analysis', name: 'analysis', label: '财务分析', icon: 'analysis' },
  { path: '/settings', name: 'settings', label: '设置', icon: 'settings' }
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
        <span class="logo">💰</span>
        <h1>财务管理系统</h1>
      </div>
      
      <nav class="nav-menu">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'active': currentRouteName === item.name }"
        >
          <div class="nav-icon-wrapper">
            <span class="nav-icon" :class="`icon-${item.icon}`"></span>
          </div>
          <span class="nav-text">{{ item.label }}</span>
        </RouterLink>
      </nav>
      
      <div class="user-info">
        <div class="avatar">{{ settingsStore.getUserName.slice(0, 1).toUpperCase() }}</div>
        <div class="user-details">
          <div class="username">{{ settingsStore.getUserName }}</div>
          <div class="user-status">
            <span class="status-dot"></span>
            <span class="status-text">在线</span>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- 主内容 -->
    <main class="main-content" :class="{ 'full-width': isLoginPage }">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #1890ff;
  --primary-hover: #40a9ff;
  --primary-active: #096dd9;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --heading-color: #222;
  --text-color: #333;
  --text-color-secondary: #666;
  --disabled-color: #bfbfbf;
  --border-color: #f0f0f0;
  --background-color: #f5f8fa;
  --component-background: #fff;
  --sidebar-background: linear-gradient(180deg, #192c3e 0%, #253b50 100%);
  --sidebar-text-color: rgba(255, 255, 255, 0.65);
  --sidebar-active-text-color: #fff;
  --card-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03);
}

html[data-theme='dark'] {
  --primary-color: #1890ff;
  --primary-hover: #40a9ff;
  --primary-active: #096dd9;
  --heading-color: #fff;
  --text-color: rgba(255, 255, 255, 0.85);
  --text-color-secondary: rgba(255, 255, 255, 0.45);
  --disabled-color: rgba(255, 255, 255, 0.3);
  --border-color: #303030;
  --background-color: #141414;
  --component-background: #1f1f1f;
  --sidebar-background: linear-gradient(180deg, #0d1117 0%, #161b22 100%);
  --sidebar-text-color: rgba(255, 255, 255, 0.45);
  --sidebar-active-text-color: #1890ff;
  --card-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.32), 0 9px 28px 0 rgba(0, 0, 0, 0.2), 0 12px 48px 16px rgba(0, 0, 0, 0.12);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 图标样式 */
.nav-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
  transition: all 0.3s;
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
  width: 240px;
  background: var(--sidebar-background);
  color: var(--sidebar-text-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.brand {
  padding: 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  font-size: 24px;
  margin-right: 12px;
}

.brand h1 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
}

.nav-menu {
  padding: 24px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  color: var(--sidebar-text-color);
  text-decoration: none;
  position: relative;
  transition: all 0.3s;
  margin: 4px 8px;
  border-radius: 6px;
}

.nav-item:hover {
  color: var(--sidebar-active-text-color);
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: var(--sidebar-active-text-color);
  background-color: rgba(24, 144, 255, 0.2);
  font-weight: 500;
}

.nav-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--primary-color);
  border-radius: 0 3px 3px 0;
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  margin-right: 12px;
  transition: all 0.3s;
}

.active .nav-icon-wrapper {
  background-color: rgba(24, 144, 255, 0.2);
}

.nav-text {
  font-size: 15px;
}

.user-info {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  margin: 8px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  margin-right: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

.user-details {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
}

.user-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #52c41a;
  margin-right: 6px;
}

.status-text {
  font-size: 12px;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 30px 40px;
  background-color: var(--background-color);
  min-height: 100vh;
  width: calc(100% - 240px);
  box-sizing: border-box;
  transition: all 0.3s ease;
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
  
  .user-status {
    display: none;
  }
  
  .avatar {
    margin-right: 0;
  }
  
  .user-details {
    display: none;
  }
  
  .user-info {
    justify-content: center;
    padding: 12px;
  }
  
  .nav-item {
    justify-content: center;
    padding: 0;
  }
  
  .nav-icon-wrapper {
    margin-right: 0;
  }
  
  .main-content:not(.full-width) {
    margin-left: 80px;
    width: calc(100% - 80px);
    padding: 20px;
  }
}
</style>
