<template>
  <AdminLayout>
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Eventos</h2>
      
      <div v-if="eventStore.loading" class="text-center p-8">
        Cargando...
      </div>
      
      <div v-else>
        {{ eventStore.events }}
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const eventStore = useEventStore()

onMounted(() => {
  eventStore.fetchEvents()
})
</script>