import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Redirige la ruta raíz '/' a '/admin/dashboard'
    {
      path: '/',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin',
      component: () => import('../components/layout/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/admin/Dashboard.vue')
        },
        {
          path: 'events',
          component: () => import('../views/admin/events/EventListView.vue')
        },
        {
          path: 'events/create',
          component: () => import('../views/admin/events/CreateEventView.vue')
        },
        {
          path: 'events/edit/:id',
          component: () => import('../views/admin/events/EventEditView.vue')
        },
        {
          path: 'tickets/:eventId',
          component: () => import('../views/admin/tickets/TicketListView.vue')
        },
        {
          path: 'scanner',
          component: () => import('../views/admin/scanner/ScannerView.vue')
        }
      ]
    }
  ]
})

export default router