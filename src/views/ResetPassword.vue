<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

//  token desde la URL
const token = route.query.token

const password = ref('')
const confirmPassword = ref('')

const message = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value
})

const handleResetPassword = async () => {
  message.value = ''
  errorMessage.value = ''

  if (!token) {
    errorMessage.value = 'Token inválido o faltante'
    return
  }

  if (!passwordsMatch.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  isLoading.value = true

  try {
    await api.post('/auth/reset-password', {
      token: token,
      newPassword: password.value
    })

    message.value = 'Contraseña actualizada correctamente'

    // opcional: redirigir al login después de 2s
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'No se pudo cambiar la contraseña'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#313030] p-6 text-white">

    <div class="w-full max-w-md bg-white text-black rounded-xl p-8 shadow-xl">

      <h1 class="text-2xl font-bold mb-2 text-center">Reset Password</h1>
      <p class="text-sm text-gray-500 mb-6 text-center">
        Ingresa tu nueva contraseña
      </p>

      <!-- Mensajes -->
      <div v-if="message" class="bg-green-100 text-green-700 p-3 mb-4 rounded">
        {{ message }}
      </div>

      <div v-if="errorMessage" class="bg-red-100 text-red-600 p-3 mb-4 rounded">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleResetPassword" class="space-y-4">

        <!-- Nueva contraseña -->
        <div>
          <label class="text-sm font-semibold">Nueva contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <!-- Confirmar -->
        <div>
          <label class="text-sm font-semibold">Confirmar contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <!-- warning match -->
        <p v-if="confirmPassword && !passwordsMatch" class="text-red-500 text-sm">
          Las contraseñas no coinciden
        </p>

        <!-- botón -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-black text-white p-3 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          <span v-if="isLoading">Actualizando...</span>
          <span v-else>Cambiar contraseña</span>
        </button>

      </form>
    </div>

  </div>
</template>