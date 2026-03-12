<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '@/stores/eventStore'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const router = useRouter()
const eventStore = useEventStore()

const form = ref({
  name: '',
  description: '',
  eventDate: new Date().toISOString().split('T')[0], // Fecha actual por defecto
  /*date: '',
  time: '',*/
  location: '',
  maxCapacity: ''
  /*status: 'activo'*/
})

const handleSubmit = async () => {
  try {
    await eventStore.createEvent(form.value)
    router.push('/')
  } catch (error) {
    alert('Error al crear el evento: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Crear Nuevo Evento</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del evento *</label>
          <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Conferencia de Tecno 2026">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe el evento..."></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha del Evento *</label>
            <input v-model="form.date" type="date" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <p class="text-sm text-gray-500 mt-1">Formato: AAAA-MM-DD</p>
          </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Lugar</label>
          <input v-model="form.location" type="text" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"  placeholder="Ej: Centro de Convenciones">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Capacidad Máxima</label>
          <input v-model="form.capacity" type="number" min="1" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"  placeholder="Ej: 1003">
        </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <router-link to="/">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          </router-link>
          <button type="submit" :disabled="eventStore.loading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {{ eventStore.loading ? 'Creando...' : 'Crear Evento' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>
