<template>
  <AdminLayout>
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Crear Nuevo Evento</h2>
      
      <form class="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        
        <div class="flex justify-end space-x-3">
          <button type="button" class="px-4 py-2 border rounded-md">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
