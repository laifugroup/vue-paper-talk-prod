import { createRouter, createWebHistory } from 'vue-router'
import PagerView from '../views/PagerView.vue'
import SealView from '../views/SealView.vue'
import LionLakeView from '../views/LionLakeView.vue'
import LionLakePDFView from '../views/LionLakePDFView.vue'

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
    },
    {
      path: '/lionLake',
      name: 'lionLake',
      component: LionLakeView,
    },
    {
      path: '/lionLakePDF',
      name: 'LionLakePDF',
      component: LionLakePDFView,
    }
  ],
})

export default router
