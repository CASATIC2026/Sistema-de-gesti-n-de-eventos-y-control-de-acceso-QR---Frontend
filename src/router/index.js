import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'events',
      component: () => import('@/views/events/EventListView.vue')
    },
    {
      path: '/events/create',
      name: 'event-create',
      component: () => import('../views/events/EvenCreateView.vue')
    }
  ]
})

export default router