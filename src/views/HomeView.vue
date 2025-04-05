<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '../stores/transactions'
import { useBudgetStore } from '../stores/budget'
import { useSettingsStore } from '../stores/settings'
import DashboardSummary from '../components/DashboardSummary.vue'
import TransactionList from '../components/TransactionList.vue'
import BudgetProgress from '../components/BudgetProgress.vue'
import ExpenseChart from '../components/ExpenseChart.vue'
import IncomeExpenseChart from '../components/IncomeExpenseChart.vue'
import { RouterLink } from 'vue-router'

const router = useRouter()
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()

const isLoading = ref(true)
const apiError = ref(null)

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const currentMonthName = monthNames[currentMonth]

// 获取数据
onMounted(async () => {
  try {
    await Promise.all([
      transactionStore.fetchTransactions(),
      budgetStore.fetchBudgets(),
      settingsStore.fetchSettings()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
    apiError.value = error.message || '获取数据失败，请检查网络连接和服务器状态'
    
    // 如果API请求返回403，可能是认证问题，尝试清除令牌并重定向到登录页
    if (error.response && error.response.status === 403) {
      console.log('认证失败，清除令牌并重定向到登录页')
      localStorage.removeItem('token')
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
})

// 获取本月的收支数据
const monthlyTransactions = computed(() => {
  return transactionStore.getTransactionsByMonth(currentMonth, currentYear)
})

// 获取最近的交易记录（最多5条）
const recentTransactions = computed(() => {
  return [...transactionStore.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

// 预算进度数据
const budgetProgressData = computed(() => {
  return budgetStore.getAllBudgetProgress
})

// 重新登录
const handleRelogin = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    
    <div v-if="isLoading" class="loading-state">
      加载中...
    </div>
    
    <div v-else-if="apiError" class="error-state">
      <h3>数据加载失败</h3>
      <p>{{ apiError }}</p>
      <div class="error-actions">
        <button @click="handleRelogin" class="login-button">重新登录</button>
      </div>
    </div>
    
    <template v-else>
      <section class="section">
        <DashboardSummary />
      </section>
      
      <section class="section">
        <h2>财务概览</h2>
        <div class="charts-grid">
          <div class="chart-wrapper">
            <IncomeExpenseChart :transactions="monthlyTransactions" />
          </div>
          <div class="chart-wrapper">
            <ExpenseChart :transactions="monthlyTransactions" />
          </div>
        </div>
      </section>
      
      <section class="section">
        <div class="recent-transactions-section">
          <div class="section-header">
            <h2>近期交易</h2>
            <RouterLink to="/transactions" class="view-all">
              查看全部
            </RouterLink>
          </div>
          <TransactionList :transactions="recentTransactions" :compact="true" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 100%;
  margin: 0 auto;
  width: 900px;
}

h1 {
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #444;
}

.section {
  margin-bottom: 30px;
  padding: 0;
}

.loading-state {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #888;
}

.error-state {
  text-align: center;
  padding: 50px;
  color: #ff4d4f;
  background-color: #fff1f0;
  border-radius: 8px;
  margin-top: 20px;
}

.error-state h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.error-state p {
  margin-bottom: 20px;
  color: #666;
}

.error-actions {
  margin-top: 20px;
}

.login-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.login-button:hover {
  background-color: #40a9ff;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 35px;
}

.chart-wrapper {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.recent-transactions-section {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all {
  color: #1890ff;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.view-all:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
