import { createWebHistory, createRouter } from 'vue-router'
import UpcomingPage from './pages/UpcomingPage.vue'
import PreviousPage from './pages/PreviousPage.vue'

const routes = [
  {
    path: '/',
    name: 'Upcoming',
    component: UpcomingPage,
  },
  {
    path: '/previous',
    name: 'Previous',
    component: PreviousPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
