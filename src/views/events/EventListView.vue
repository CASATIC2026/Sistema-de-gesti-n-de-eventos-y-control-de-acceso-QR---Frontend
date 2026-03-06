<template>
    <AdminLayout>
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900">Eventos</h2>
                <router-link to="/events/create">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        + Nuevo Evento
                    </button>
                </router-link>
            </div>

            <!-- Error -->
            <!-- Mostrar error si existe -->
            <div v-if="eventStore.error" class="bg-red-50 text-red-800 p-4 rounded-md">
                {{ eventStore.error }}
            </div>

            <!-- Tabla de eventos -->
            <div class="bg-white shadow-sm rounded-lg overflow-hidden">
                <div v-if="eventStore.loading" class="p-8 text-center">
                    Cargando eventos...
                </div>


                <table v-else class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lugar</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacidad</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>

                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="event in eventStore.events" :key="event.id">
                            <td class="px-6 py-4">{{ event.name }}</td>
                            <td class="px-6 py-4">{{ formatDate(event.eventDate) }}</td>
                            <td class="px-6 py-4">{{ event.location || 'No especificado' }}</td>
                            <td class="px-6 py-4">
                                {{ event.maxCapacity ? event.maxCapacity.toLocaleString() : 'Ilimitado' }}
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <router-link :to="`/events/${event.id}/edit`">
                                    <button class="text-blue-600 hover:text-blue-900">
                                        Editar
                                    </button>
                                </router-link>
                                <button @click="handleDelete(event.id)" class="text-red-600 hover:text-red-900 ml-2"
                                    :disabled="eventStore.loading">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Resumen -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="text-sm font-medium text-gray-500">Total Eventos</h3>
                    <p class="text-2xl font-bold">{{ eventStore.totalEvents }}</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="text-sm font-medium text-gray-500">Próximos Eventos</h3>
                    <p class="text-2xl font-bold">{{ eventStore.upcomingEvents.length }}</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="text-sm font-medium text-gray-500">Capacidad Total</h3>
                    <p class="text-2xl font-bold">{{ totalCapacity.toLocaleString() }}</p>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEventStore } from '../../stores/eventStore'
import AdminLayout from '../../components/layout/AdminLayout.vue'

const eventStore = useEventStore()

/*metodo para formatear fechas en españo */
const formatDate = (date) => {
    if (!date) return 'Fecha no disponible'
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const totalCapacity = computed(() => {
  return eventStore.events.reduce((acc, event) => acc + (event.maxCapacity || 0), 0)
})

const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
        try {
            await eventStore.deleteEvent(id)
        } catch (error) {
            alert('Error al eliminar el evento: ' + (error.response?.data?.message || error.message))
        }
    }
}

onMounted(() => {
    eventStore.fetchEvents()
})
</script>