import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/events/:id/edit',
      name: 'edit-event',
      component: () => import('@/views/events/EventEditView.vue')
    }
  ]
})

export default router
