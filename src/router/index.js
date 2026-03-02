import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {

      path: '/events/create',
      name: 'create-event',
      component: () => import('@/views/events/EventCreateView.vue')

    }
  ]
})

export default router
