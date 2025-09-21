import { createWebHistory, createRouter } from 'vue-router'
import UpcomingPage from '@pages/UpcomingPage.vue'
import PreviousPage from '@pages/PreviousPage.vue'
import SuggestionsCreatePageVue from '@pages/SuggestionsCreatePage.vue'
import AdminPage from '@pages/AdminPage.vue'
import EventPage from '@pages/EventPage.vue'
import PageNotFound from '@pages/PageNotFound.vue'
import EventsByTagPage from '@pages/EventsByTagPage.vue'

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
    path: '/:tag',
    name: 'Events By Tag',
    component: EventsByTagPage,
    props: true,
  },
  {
    path: '/event/:id',
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
