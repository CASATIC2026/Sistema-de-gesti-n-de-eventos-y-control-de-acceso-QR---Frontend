import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue')
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

router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");

  // rutas públicas
  if (to.path === "/login") {
      return token ? "/admin/dashboard" : true;
  }

  // rutas privadas
  if (!token) {
     return "/login";
  }

 return true;
});



export default router