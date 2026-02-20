<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Navbar />
      <main class="flex-1 p-6 bg-gray-100">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/admin/Sidebar.vue'
import Navbar from '../components/admin/Navbar.vue'
</script>
