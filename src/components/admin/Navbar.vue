<template>
  <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

    <!-- Botón hamburguesa móvil -->
    <button
      @click="$emit('toggle')"
      class="md:hidden text-2xl"
    >
      ☰
    </button>

    <h2 class="font-semibold text-gray-700">
      Panel Administrativo
    </h2>

    <div class="text-sm text-gray-500">
      Admin
    </div>

  </header>
</template>