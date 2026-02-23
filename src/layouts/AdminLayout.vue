<template>
  <div class="flex min-h-screen bg-white">

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#fadd8b] border-r border-yellow-300 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ]"
    >
      <Sidebar />
    </aside>

    <!-- Contenido -->
    <div class="flex-1 flex flex-col">

      <Navbar @toggle="isOpen = !isOpen" />

      <!-- Contenedor central -->
      <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/admin/Sidebar.vue'
import Navbar from '../components/admin/Navbar.vue'

const isOpen = ref(false)
</script>