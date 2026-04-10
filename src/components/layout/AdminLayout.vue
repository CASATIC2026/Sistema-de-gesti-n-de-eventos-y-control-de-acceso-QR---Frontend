<template>
  <div class="min-h-screen flex bg-tertiary">

    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-neutral text-white p-6 shadow-lg">
      <h2 class="text-2xl font-bold text-primary mb-8">EventAdmin</h2>

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
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6">
      <router-view />
    </main>

  </div>
</template>