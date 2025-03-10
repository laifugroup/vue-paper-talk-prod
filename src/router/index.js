import { createRouter, createWebHistory } from 'vue-router'
import PagerView from '../views/PagerView.vue'
import SealView from '../views/SealView.vue'
import TextTestView from '../views/TextTestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pager',
      component: PagerView,
    },
    {
      path: '/seal',
      name: 'seal',
      component: SealView,
    }
  ],
})

export default router
