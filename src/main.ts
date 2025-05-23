import { createApp } from 'vue'
import App from './popup/App.vue'
import './assets/main.css'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app') 