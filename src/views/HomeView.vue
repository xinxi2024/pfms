<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransactionStore } from '../stores/transactions'
import { useBudgetStore } from '../stores/budget'
import { useSettingsStore } from '../stores/settings'
import DashboardSummary from '../components/DashboardSummary.vue'
import TransactionList from '../components/TransactionList.vue'
import BudgetProgress from '../components/BudgetProgress.vue'
import ExpenseChart from '../components/ExpenseChart.vue'
import IncomeExpenseChart from '../components/IncomeExpenseChart.vue'
import { RouterLink } from 'vue-router'

const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const settingsStore = useSettingsStore()

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const currentMonthName = monthNames[currentMonth]

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
</script>

<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    
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
