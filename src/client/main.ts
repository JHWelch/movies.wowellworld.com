import { createApp } from 'vue'
import '@client/style.css'
import App from '@client/App.vue'
import router from '@client/router'

createApp(App).use(router).mount('#app')
