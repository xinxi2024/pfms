import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'

// 引入Naive UI
import naive from 'naive-ui'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(naive)

app.mount('#app')
