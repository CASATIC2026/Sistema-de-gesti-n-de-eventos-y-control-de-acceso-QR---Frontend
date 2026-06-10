import { createRouter, createWebHistory } from 'vue-router'

import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    // HOME PÚBLICA
    {
      path: '/',
      component: () => import('../views/UserHome.vue')
    },

    // AUTH
    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },

    {
      path: '/register',
      component: () => import('../views/Register.vue')
    },

    {
      path: '/forgot-password',
      component: ForgotPassword
    },

    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword
    },

    // PERFIL
    {
      path: '/complete-profile',
      name: 'CompleteProfile',
      component: () => import('../views/CompleteProfile.vue'),
      meta: { requiresAuth: true }
    },

 

    // SOLO ADMIN
    {
      path: '/scanner',
      component: () => import('../views/ScannerView.vue'),
      meta: { requiresAdmin: true }
    },

    {
      path: '/dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAdmin: true }
    },

    {
      path: '/admin',
      component: () => import('../components/layout/AdminLayout.vue'),
      meta: { requiresAdmin: true }
    }
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const profileCompleted = localStorage.getItem('profileCompleted')

  // SOLO ADMIN
  if (to.meta.requiresAdmin) {
    if (!token) {
      return '/login'
    }

    if (role !== 'Admin') {
      return '/'
    }
  }

  // REQUIERE LOGIN
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  // SI YA ESTÁ LOGUEADO Y QUIERE IR A LOGIN/REGISTER
  if (
    token &&
    ['/login', '/register'].includes(to.path)
  ) {
    if (role === 'Admin') {
      return '/dashboard'
    }

    return '/'
  }

  // COMPLETAR PERFIL (solo usuarios normales)
  if (
    token &&
    role !== 'Admin' &&
    profileCompleted === 'false' &&
    to.path !== '/complete-profile'
  ) {
    return '/complete-profile'
  }

  // EVITAR VOLVER A COMPLETE-PROFILE SI YA ESTÁ COMPLETO
  if (
    token &&
    role !== 'Admin' &&
    profileCompleted === 'true' &&
    to.path === '/complete-profile'
  ) {
    return '/'
  }

  return true
})

export default router