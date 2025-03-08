import { createRouter, createWebHistory } from 'vue-router'
import PagerView from '../views/PagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pager',
      component: PagerView,
    },
  ],
})

export default router
