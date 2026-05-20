import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: () => import('../views/UserHome.vue')
    },

    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },

    {
      path: '/register',
      component: () => import('../views/Register.vue')
    },

     {
      path: '/scanner',
      component: () => import('../views/ScannerView.vue'),
    },

    // Rutas admin
    {
      path: '/dashboard',
          component: () => import('../views/Dashboard.vue'),

      meta: { requiresAdmin: true },

      children: [
        {
          
           path: '/admin',
      component: () => import('../components/layout/AdminLayout.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // rutas públicas
  if (to.path === '/login' || to.path === '/register') {
    return token ? '/dashboard' : true
  }

  // proteger rutas admin
  if (to.meta.requiresAdmin) {
    if (!token) {
      return '/login'
    }

    if (role !== 'Admin') {
      return '/'
    }
  }

  return true
})

export default router