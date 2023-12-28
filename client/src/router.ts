import { createWebHistory, createRouter } from 'vue-router'
import UpcomingPage from './pages/UpcomingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Upcoming',
    component: UpcomingPage,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
