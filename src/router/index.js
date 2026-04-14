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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // rutas públicas
  if (to.path === "/login") {
    if (token) {
      return next("/admin/dashboard"); // ya logueado
    }
    return next();
  }

  // rutas privadas
  if (!token) {
    return next("/login");
  }

  next();
});



export default router