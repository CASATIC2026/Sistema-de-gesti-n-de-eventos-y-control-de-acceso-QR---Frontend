<script setup>
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const mobileMenuOpen = ref(false);

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
  <div class="min-h-screen bg-[#F5F5F5] font-['Work_Sans']">
    
    <!-- Sidebar Desktop -->
    <aside class="hidden md:flex fixed inset-y-0 left-0 z-20 w-72 bg-[#121212] text-white shadow-2xl">
      <div class="flex flex-col h-full w-full p-6">
        
        <!-- Logo y título -->
        <div class="flex items-center gap-3 mb-10 pb-4 border-b border-[#333333]">
          <div class="w-10 h-10 bg-[#C5A028] rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-[#121212]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold font-['Manrope'] tracking-tight text-[#C5A028]">EventsAdmin</h2>
            <p class="text-xs text-[#F5F5F5]/60">Panel de Control</p>
          </div>
        </div>

        <!-- Navegación -->
        <nav class="flex-1 space-y-2">
          <router-link 
            to="/admin/dashboard" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F5F5]/70 hover:bg-[#333333] hover:text-[#C5A028] transition-all duration-200 group"
            active-class="bg-[#333333] text-[#C5A028] shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="font-['Work_Sans']">Dashboard</span>
          </router-link>

          <router-link 
            to="/admin/events" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F5F5]/70 hover:bg-[#333333] hover:text-[#C5A028] transition-all duration-200"
            active-class="bg-[#333333] text-[#C5A028] shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="font-['Work_Sans']">Eventos</span>
          </router-link>

          <router-link 
            to="/admin/scanner" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F5F5]/70 hover:bg-[#333333] hover:text-[#C5A028] transition-all duration-200"
            active-class="bg-[#333333] text-[#C5A028] shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
            <span class="font-['Work_Sans']">Escáner QR</span>
          </router-link>
        </nav>

        <!-- Usuario + Logout -->
        <div class="pt-6 mt-auto border-t border-[#333333]">
          <div class="flex items-center gap-3 mb-4 p-3 bg-[#333333]/50 rounded-xl">
            <div class="w-10 h-10 bg-[#C5A028] rounded-full flex items-center justify-center">
              <span class="text-sm font-bold text-[#121212]">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate font-['Work_Sans']">{{ user?.email || "Usuario" }}</p>
              <p class="text-xs text-[#F5F5F5]/60 font-['Work_Sans']">Administrador</p>
            </div>
          </div>
          <button
            @click="logout"
            class="w-full flex items-center justify-center gap-2 bg-[#C5A028] hover:bg-[#C5A028]/80 text-[#121212] py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="font-['Work_Sans']">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="md:ml-72 flex flex-col min-h-screen">
      
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b border-[#333333]/10">
        <div class="px-6 py-4 flex justify-between items-center">
          
          <!-- Botón menú móvil -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-[#333333]/10 transition-colors"
          >
            <svg class="w-6 h-6 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          
          <h1 class="text-xl font-bold font-['Manrope'] text-[#333333]">
            Panel Administrativo
          </h1>

          <!-- usuario en móvil -->
          <div class="md:hidden">
            <div class="w-8 h-8 bg-[#C5A028] rounded-full flex items-center justify-center">
              <span class="text-xs font-bold text-[#121212]">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Menu -->
      <div 
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-50 md:hidden"
        @click.self="mobileMenuOpen = false"
      >
        <div class="fixed inset-y-0 left-0 w-72 bg-[#121212] shadow-2xl transform transition-transform">
          <div class="flex flex-col h-full p-6">
            <!-- Logo -->
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-[#333333]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#C5A028] rounded-xl"></div>
                <h2 class="text-xl font-bold font-['Manrope'] text-[#C5A028]">EventsAdmin</h2>
              </div>
              <button @click="mobileMenuOpen = false" class="text-[#F5F5F5]/60 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <nav class="flex-1 space-y-2">
              <router-link 
                to="/admin/dashboard" 
                @click="mobileMenuOpen = false" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F5F5]/70 hover:bg-[#333333] hover:text-[#C5A028] transition-all"
              >
                <span class="font-['Work_Sans']">Dashboard</span>
              </router-link>
              <router-link 
                to="/admin/events" 
                @click="mobileMenuOpen = false" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F5F5]/70 hover:bg-[#333333] hover:text-[#C5A028] transition-all"
              >
                <span class="font-['Work_Sans']">Eventos</span>
              </router-link>
              <router-link 
                to="/admin/scanner" 
                @click="mobileMenuOpen = false" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F5F5]/70 hover:bg-[#333333] hover:text-[#C5A028] transition-all"
              >
                <span class="font-['Work_Sans']">Escáner</span>
              </router-link>
            </nav>
            
            <button 
              @click="logout" 
              class="mt-auto bg-[#C5A028] hover:bg-[#C5A028]/80 text-[#121212] py-2.5 rounded-xl font-semibold transition-all"
            >
              <span class="font-['Work_Sans']">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <main class="flex-1 p-6 md:p-8">
        <div class="animate-fadeIn">
          <router-view />
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>