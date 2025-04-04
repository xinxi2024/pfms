<script setup>
import { computed } from 'vue'
import { useTransactionStore } from '../stores/transactions'
import { useSettingsStore } from '../stores/settings'

const transactionStore = useTransactionStore()
const settingsStore = useSettingsStore()

// 获取当前月份信息
const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

// 获取本月的收支数据
const monthlyTransactions = computed(() => {
  return transactionStore.getTransactionsByMonth(currentMonth, currentYear)
})

// 计算本月总收入
const monthlyIncome = computed(() => {
  return monthlyTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
})

// 计算本月总支出
const monthlyExpense = computed(() => {
  return monthlyTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
})

// 计算本月净余额
const monthlyBalance = computed(() => {
  return monthlyIncome.value - monthlyExpense.value
})

// 货币符号
const currency = computed(() => settingsStore.getCurrency)

// 判断余额的正负
const balanceClass = computed(() => {
  if (monthlyBalance.value > 0) return 'positive'
  if (monthlyBalance.value < 0) return 'negative'
  return ''
})
</script>

<template>
  <div class="dashboard-summary">
    <div class="summary-card income">
      <div class="card-title">本月收入</div>
      <div class="card-value">{{ currency }}{{ monthlyIncome.toFixed(2) }}</div>
    </div>
    
    <div class="summary-card expense">
      <div class="card-title">本月支出</div>
      <div class="card-value">{{ currency }}{{ monthlyExpense.toFixed(2) }}</div>
    </div>
    
    <div class="summary-card balance">
      <div class="card-title">本月净余额</div>
      <div class="card-value" :class="balanceClass">
        {{ monthlyBalance >= 0 ? '+' : '' }}{{ currency }}{{ monthlyBalance.toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 35px;
}

.summary-card {
  padding: 30px;
  border-radius: 8px;
  color: white;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.income {
  background: linear-gradient(135deg, #42b983, #33a06f);
}

.expense {
  background: linear-gradient(135deg, #ff7875, #ff4d4f);
}

.balance {
  background: linear-gradient(135deg, #36cfc9, #13c2c2);
}

.card-title {
  font-size: 18px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
}

.card-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: center;
}

.trend-up {
  color: #d0ffdd;
}

.trend-down {
  color: #ffd0d0;
}

.trend-neutral {
  color: #d9d9d9;
}

.trend-icon {
  margin-right: 5px;
}

.positive {
  color: #f0f0f0;
}

.negative {
  color: #ffa39e;
}
</style> 