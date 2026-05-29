<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    
    console.log("Respuesta del servidor:", response.data) // Para saber qué trajo
    
    // Obtenemos el token (manejando tanto si está envuelto en 'data' por ApiResponse como si viene directo)
    const payload = response.data.data || response.data
    const token = payload.token
    
    if (token) {
      const userRole = payload.role || 'User'
      localStorage.setItem('token', token)
      localStorage.setItem('role', userRole)
      localStorage.setItem('email', email.value)
      
      if (userRole === 'Admin') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } else {
      errorMessage.value = 'El servidor no devolvió el token de acceso.'
    }
  } catch (error) {
    console.error("Detalle del error:", error, error.response)
    if (!error.response) {
      // Error de red puro (backend apagado, error de SSL o CORS)
      errorMessage.value = 'No se pudo conectar con el servidor. Verifica que esté encendido (dotnet run) y corriendo sin problemas de certificado o puerto.'
    } else if (error.response.status === 401) {
      errorMessage.value = 'Credenciales (correo o contraseña) incorrectas.'
    } else {
      errorMessage.value = error.response?.data?.message || 'Error desconocido al intentar iniciar sesión.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
     <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <div class="min-h-screen flex items-center justify-center relative p-6 bg-[#313030] font-body text-on-surface overflow-hidden">
    <!-- Back to Home Button -->
    <router-link to="/" class="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-white hover:text-white/80 transition-colors group">
      <span class="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
      <span class="font-label uppercase tracking-widest text-[11px] font-semibold">Regresar</span>
    </router-link>
    <!-- Background Aesthetic Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-[10%] -right-[5%] w-[30%] h-[50%] bg-primary-container/10 rounded-full blur-[100px]"></div>
    </div>
    <!-- Main Card -->
    <main class="w-full max-w-[480px] z-10">
      <div class="bg-white rounded-xl shadow-[0px_20px_40px_rgba(28,27,27,0.06)] overflow-hidden">
        <!-- Branding Header -->
        <div class="pt-12 pb-8 px-10 text-center">
          <h1 class="font-headline font-bold text-3xl tracking-tighter text-on-surface mb-2">QRVentus</h1>
          <p class="font-label uppercase tracking-[0.1rem] text-[10px] text-secondary">Iniciar Sesión</p>
        </div>
        <!-- Form Section -->
        <div class="px-10 pb-12">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div v-if="errorMessage" class="p-3 rounded-md bg-error-container text-on-error-container text-sm border border-error">
              {{ errorMessage }}
            </div>
            <!-- Email Field -->
            <div class="group">
              <label class="block font-label text-[11px] font-semibold uppercase tracking-wider text-secondary mb-1 group-focus-within:text-primary transition-colors" for="email">Correo Electrónico</label>
              <input 
                v-model="email" 
                class="w-full bg-white border border-gray-200 rounded-lg py-4 px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white transition-all placeholder:text-gray-400" 
                id="email" 
                name="email" 
                placeholder="nombre@ejemplo.com" 
                required 
                type="email" 
                :disabled="isLoading"
              />
            </div>
            <!-- Password Field -->
            <div class="group">
              <div class="flex justify-between items-end mb-1">
                <label class="block font-label text-[11px] font-semibold uppercase tracking-wider text-secondary group-focus-within:text-primary transition-colors" for="password">Contraseña</label>
               <router-link 
  class="text-[11px] font-semibold text-primary hover:underline underline-offset-4 transition-all"
  to="/forgot-password"
>
  ¿Olvidaste tu contraseña?
</router-link>
              </div>
              <input 
                v-model="password" 
                class="w-full bg-white border border-gray-200 rounded-lg py-4 px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white transition-all" 
                id="password" 
                name="password" 
                required 
                type="password" 
                :disabled="isLoading"
              />
            </div>
            <!-- Login Button -->
            <button 
              :disabled="isLoading" 
              class="w-full gold-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-300 mt-2 disabled:opacity-50" 
              type="submit"
            >
              <span v-if="isLoading">Verificando...</span>
              <span v-else>Iniciar sesión</span>
            </button>
          </form>
          <!-- Divider -->
          <div class="relative my-8">
            <div aria-hidden="true" class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-outline-variant/20"></div>
            </div>
          </div>
        </div>
        <!-- Footer Info -->
        <div class="bg-gray-50 py-4 px-10 flex justify-center items-center">
          <p class="font-body text-xs text-secondary">
            ¿No tienes una cuenta? <router-link class="text-primary font-semibold hover:underline underline-offset-4" to="/register">Registrarse</router-link>
          </p>
        </div>
      </div>
      <!-- Global Footer -->
      <footer class="mt-8 text-center space-y-4">
        <div class="flex justify-center gap-6 text-[10px] font-label uppercase tracking-widest text-secondary-fixed-dim">
          <a class="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
          <a class="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
          <a class="hover:text-primary transition-colors" href="#">Soporte</a>
        </div>
        <p class="text-[10px] text-secondary-fixed-dim/60 font-body">
          © 2026 QRVentus. Todos los derechos reservados.
        </p>
      </footer>
    </main>
    <!-- Decorative Image for Visual Depth (Asymmetric Placement) -->
    <div class="fixed top-20 right-[-100px] w-[500px] h-[700px] opacity-10 pointer-events-none hidden lg:block">
      <img alt="Luxury event space" class="w-full h-full object-cover rounded-full grayscale mix-blend-overlay" data-alt="Modern architectural interior of a high-end gala hall with golden ambient lighting and minimalist structures" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHZ94x_u2Qb2edx_q-9ZvjTMFFlfAzvwunei-LvFyvi8vdyEtLq75fAEfSc6IIhCS8YEzPSkxVmg5JA5A0dqV2A3XGN0bjkEBlciodY-VMzp2pGd-YzkfHkoCBLBadmKzp_Lr5VXiDbM95v7Zyoa51GSg2wUovFlQsFg4dhW41GSkIbaL-WzeANtGsLzTyBzogEXm1E-feHfFY4qeKdPSUe31Rvw_mPPgiaaVE-Myivg_WRfdAJIlrOHOS42TwIiuvHIPUiW_BstM"/>
    </div>
  </div>
</template>
<style scoped>
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
}
.gold-gradient {
    background: linear-gradient(135deg, #745b00 0%, #d5af37 100%);
}
</style>