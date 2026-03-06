<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventStore } from '@/stores/eventStore'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const router = useRouter()
const route = useRoute()
const eventStore = useEventStore()

const form = ref({
  name: '',
  description: '',
  eventDate: '',
  location: '',
  maxCapacity: ''
})

onMounted(async () => {
  // Si ya tenemos el evento en el store
  let event = eventStore.events.find(e => e.id === Number(route.params.id))

  // Si no está en store, lo buscamos individualmente
  if (!event) {
    try {
      const response = await eventService.getById(route.params.id)
      event = response.data
    } catch (error) {
      alert('Error al cargar el evento')
      router.push('/')
      return
    }
  }

  if (event) {
    form.value = {
      name: event.name || '',
      description: event.description || '',
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      location: event.location || '',
      maxCapacity: event.maxCapacity || ''
    }
  }
})

const handleSubmit = async () => {
  try {
    await eventStore.updateEvent(route.params.id, form.value)
    router.push('/')
  } catch (error) {
    alert('Error al actualizar el evento: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Editar Evento</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <!-- es el mismo formulario que create -->
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
          <input v-model="form.maxCapacity" type="number" min="0" class="w-full px-3 py-2 border rounded-md">
        </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="router.push('/')" class="px-4 py-2 border rounded-md">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">
            Actualizar
            </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>