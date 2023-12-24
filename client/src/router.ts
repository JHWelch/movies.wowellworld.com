import { createWebHistory, createRouter } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import About from './pages/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
