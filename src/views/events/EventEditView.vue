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
  date: '',
  time: '',
  location: '',
  capacity: '',
  status: 'activo'
})

onMounted(async () => {
  const event = eventStore.events.find(e => e.id === Number(route.params.id))
  if (event) {
    form.value = { ...event }
  }
})

const handleSubmit = async () => {
  try {
    await eventStore.updateEvent(route.params.id, form.value)
    router.push('/')
  } catch (error) {
    alert('Error al actualizar el evento')
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
          <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-md">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-md"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
            <input v-model="form.date" type="date" required class="w-full px-3 py-2 border rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hora</label>
            <input v-model="form.time" type="time" class="w-full px-3 py-2 border rounded-md">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Lugar</label>
          <input v-model="form.location" type="text" class="w-full px-3 py-2 border rounded-md">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Aforo Máximo</label>
          <input v-model="form.capacity" type="number" min="1" class="w-full px-3 py-2 border rounded-md">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select v-model="form.status" class="w-full px-3 py-2 border rounded-md">
            <option value="activo">Activo</option>
            <option value="borrador">Borrador</option>
          </select>
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