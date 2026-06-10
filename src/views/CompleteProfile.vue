<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const birthDate = ref('')
const gender = ref('')
const loading = ref(false)

const saveProfile = async () => {
  if (!birthDate.value || !gender.value) return

  loading.value = true

  try {
    await api.put('/user/profile', {
      birthDate: birthDate.value,
      gender: gender.value
    })

    localStorage.setItem('profileCompleted', 'true')
    router.push('/')
 } catch (error) {
    console.error('ERROR COMPLETO:', error)

    if (error.response) {
      console.log('STATUS:', error.response.status)
      console.log('DATA:', error.response.data)
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-surface">

    <div class="w-full max-w-md bg-surface-container-low rounded-2xl p-8">

      <h1 class="text-3xl font-bold font-headline mb-2">
        Completa tu perfil
      </h1>

      <p class="text-secondary mb-6">
        Necesitamos algunos datos para mejorar tus estadísticas de eventos
      </p>

      <!-- Fecha -->
      <div class="mb-4">
        <label class="text-sm text-secondary">Fecha de nacimiento</label>
        <input
          type="date"
          v-model="birthDate"
          class="w-full mt-1 p-3 rounded-xl bg-surface-container"
        />
      </div>

      <!-- Sexo -->
      <div class="mb-6">
        <label class="text-sm text-secondary">Sexo</label>

        <select
          v-model="gender"
          class="w-full mt-1 p-3 rounded-xl bg-surface-container"
        >
          <option value="">Selecciona</option>
          <option value="Male">Hombre</option>
          <option value="Female">Mujer</option>
          <option value="Other">Otro</option>
          <option value="PreferNotToSay">Prefiero no decirlo</option>
        </select>
      </div>

      <button
        @click="saveProfile"
        class="w-full py-3 rounded-xl bg-primary text-white font-bold"
        :disabled="loading"
      >
        {{ loading ? 'Guardando...' : 'Guardar perfil' }}
      </button>

    </div>

  </section>
</template>