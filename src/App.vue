<template>
 <router-view />
 <Toast/>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from './services/api'
import Toast from "./components/Toast.vue";

const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')
   if (!token) return

  try {
    const { data } = await api.get('/user/me')

    const user = data.data || data

    if (!user.profileCompleted) {
      router.push('/complete-profile')
    }

  } catch (error) {
    console.error('Error verificando perfil:', error)
  }
})

</script>

