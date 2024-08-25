import { createWebHistory, createRouter } from 'vue-router'
import UpcomingPage from '@pages/UpcomingPage.vue'
import PreviousPage from '@pages/PreviousPage.vue'
import SuggestionsCreatePageVue from '@pages/SuggestionsCreatePage.vue'

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
  {
    path: '/suggestions/create',
    name: 'Create Suggestion',
    component: SuggestionsCreatePageVue,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
