<template>
    <AdminLayout>
        <div class="space-y-6">

            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900">Eventos</h2>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    + Nuevo Evento
                </button>
            </div>

            <div v-if="eventStore.loading" class="text-center p-8">
                Cargando...
            </div>

            <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aforo</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="event in eventStore.events" :key="event.id">
                            <td class="px-6 py-4">{{ event.name }}</td>
                            <td class="px-6 py-4">{{ formatDate(event.date) }}</td>
                            <td class="px-6 py-4">{{ event.capacity || 'Ilimitado' }}</td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button class="text-blue-600 hover:text-blue-900">Editar</button>
                                <button class="text-red-600 hover:text-red-900">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </AdminLayout>

</template>

<script setup>
import { onMounted } from 'vue'
import { useEventStore } from '../stores/eventStore'
import AdminLayout from '../components/layout/AdminLayout.vue'

/*metodo para formatear fechas en españo */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const eventStore = useEventStore()

onMounted(() => {
    eventStore.fetchEvents()
})
</script>