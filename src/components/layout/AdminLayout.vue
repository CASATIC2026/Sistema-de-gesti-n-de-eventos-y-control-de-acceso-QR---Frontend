<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

// obtener usuario
const user = computed(() => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
});

// logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<template>
  <div class="min-h-screen flex bg-tertiary">

    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-neutral text-white p-6 shadow-lg">

      <h2 class="text-2xl font-bold text-primary mb-8">Events Admin</h2>

      <!-- Navegación -->
      <nav class="flex flex-col gap-4 text-sm">

        <router-link to="/admin/dashboard" class="hover:text-primary transition">
          Dashboard
        </router-link>

        <router-link to="/admin/events" class="hover:text-primary transition">
          Eventos
        </router-link>

        <router-link to="/admin/scanner" class="hover:text-primary transition">
          Escáner
        </router-link>
      </nav>

       <!-- Usuario + Logout -->
      <div class="mt-auto pt-6 border-t border-gray-700">

        <p class="text-sm text-gray-300 mb-2">
          {{ user?.email || "Usuario" }}
        </p>

        <button
          @click="logout"
          class="w-full bg-red-500 hover:opacity-90 text-white py-2 rounded-lg text-sm transition"
        >
          Cerrar sesión
        </button>
         </div>
         
    </aside>

     <!-- Main -->
    <div class="flex-1 flex flex-col">

      <!-- Header -->
      <header class="bg-white shadow px-6 py-3 flex justify-between items-center">
        
        <h1 class="text-lg font-semibold text-secondary">
          Panel Administrativo
        </h1>

        <!-- usuario en móvil -->
        <div class="md:hidden text-sm text-gray-600">
          {{ user?.email }}
        </div>

      </header>

      <!-- Contenido -->
      <main class="flex-1 p-4 md:p-6">
        <router-view />
      </main>

    </div>

  </div>

</template>