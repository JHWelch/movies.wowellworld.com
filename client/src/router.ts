import { createWebHistory, createRouter } from 'vue-router'
import UpcomingPage from '@pages/UpcomingPage.vue'
import PreviousPage from '@pages/PreviousPage.vue'
import SuggestionsCreatePageVue from '@pages/SuggestionsCreatePage.vue'
import AdminPage from '@pages/AdminPage.vue'
import EventPage from '@pages/EventPage.vue'
import PageNotFound from '@pages/PageNotFound.vue'

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
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
  },
  {
    path: '/404',
    component: PageNotFound,
  },
  {
    path: '/:id',
    name: 'Event Details',
    component: EventPage,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
