import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import EventsView from '../views/EventsView.vue'

const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: AdminDashboard
      },
      {
        path: 'events',
        component: EventsView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router