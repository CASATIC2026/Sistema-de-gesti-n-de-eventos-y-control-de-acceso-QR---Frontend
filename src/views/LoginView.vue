<script setup>
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const showForgotPassword = ref(false);
const resetEmail = ref("");
const resetMessage = ref("");
const resetError = ref("");

const router = useRouter();

const login = async () => {
  if (!email.value || !password.value) {
    error.value = "Por favor completa todos los campos";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value
    });

    console.log("RESPUESTA LOGIN:", res.data);

    const token = res.data.data.token;

    console.log("TOKEN EXTRAÍDO:", token);

    if (!token) {
      throw new Error("Token no recibido del backend");
    }

    localStorage.setItem("token", token);
    
    // Guardar información del usuario si viene
    if (res.data.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
    }

    router.push("/admin/events");

  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Credenciales incorrectas";
  } finally {
    isLoading.value = false;
  }
};

const sendResetPassword = async () => {
  if (!resetEmail.value) {
    resetError.value = "Ingresa tu correo electrónico";
    return;
  }

  resetMessage.value = "";
  resetError.value = "";
  
  try {
    // Ajusta el endpoint según tu backend
    await api.post("/auth/forgot-password", {
      email: resetEmail.value
    });
    
    resetMessage.value = "Te hemos enviado un enlace para restablecer tu contraseña";
    setTimeout(() => {
      showForgotPassword.value = false;
      resetEmail.value = "";
      resetMessage.value = "";
    }, 3000);
    
  } catch (err) {
    console.error(err);
    resetError.value = err.response?.data?.message || "Error al enviar el correo";
  }
};

// Función para manejar tecla Enter
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !isLoading.value) {
    login();
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F5] font-['Work_Sans'] p-4">
    
    <!-- Modal de olvidé contraseña -->
    <div 
      v-if="showForgotPassword" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showForgotPassword = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-fadeIn">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#C5A028]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#C5A028]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12 12.75v-4.5m0 9h.008c.412 0 .75-.337.75-.75 0-.413-.338-.75-.75-.75H12m-7.5 0h15m-15 0v6m15-6v6"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold font-['Manrope'] text-[#333333] mb-2">
            ¿Olvidaste tu contraseña?
          </h2>
          <p class="text-sm text-[#333333]/60">
            Ingresa tu correo y te enviaremos un enlace para restablecerla
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#333333] mb-2">
              Correo electrónico
            </label>
            <input
              v-model="resetEmail"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              class="w-full px-4 py-2.5 border border-[#333333]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A028] focus:border-transparent transition-all font-['Work_Sans']"
              @keypress.enter="sendResetPassword"
            />
          </div>

          <p v-if="resetMessage" class="text-green-600 text-sm text-center">
            {{ resetMessage }}
          </p>
          <p v-if="resetError" class="text-red-500 text-sm text-center">
            {{ resetError }}
          </p>

          <div class="flex gap-3 pt-2">
            <button
              @click="showForgotPassword = false"
              class="flex-1 px-4 py-2.5 border border-[#333333]/20 rounded-xl text-[#333333] hover:bg-[#333333]/5 transition-all font-['Work_Sans']"
            >
              Cancelar
            </button>
            <button
              @click="sendResetPassword"
              class="flex-1 px-4 py-2.5 bg-[#C5A028] hover:bg-[#C5A028]/90 text-[#121212] rounded-xl font-semibold transition-all shadow-lg shadow-[#C5A028]/30"
            >
              Enviar enlace
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Card -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
      
      <!-- Header decorativo -->
      <div class="h-2 bg-gradient-to-r from-[#C5A028] to-[#C5A028]/50"></div>
      
      <div class="p-6 md:p-8">
        
        <!-- Logo y título -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-[#C5A028]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-[#C5A028]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold font-['Manrope'] text-[#333333] mb-2">
            Bienvenido
          </h1>
          <p class="text-sm text-[#333333]/60">
            Inicia sesión para continuar
          </p>
        </div>

        <!-- Formulario -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#333333] mb-2">
              Correo electrónico
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#333333]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
              <input 
                v-model="email" 
                type="email"
                placeholder="tucorreo@ejemplo.com"
                class="w-full pl-10 pr-4 py-2.5 border border-[#333333]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A028] focus:border-transparent transition-all font-['Work_Sans']"
                @keypress="handleKeyPress"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#333333] mb-2">
              Contraseña
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#333333]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 border border-[#333333]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A028] focus:border-transparent transition-all font-['Work_Sans']"
                @keypress="handleKeyPress"
              />
            </div>
          </div>

          <!-- Link olvidé contraseña -->
          <div class="text-right">
            <button
              @click="showForgotPassword = true"
              class="text-sm text-[#C5A028] hover:text-[#C5A028]/80 transition-colors font-['Work_Sans']"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-3">
            <p class="text-red-600 text-sm text-center">
              {{ error }}
            </p>
          </div>

          <!-- Botón login -->
          <button
            @click="login"
            :disabled="isLoading"
            class="w-full bg-[#C5A028] hover:bg-[#C5A028]/90 text-[#121212] py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#C5A028]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Work_Sans']"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
          </button>
        </div>

        <!-- Footer -->
        <div class="mt-6 pt-6 border-t border-[#333333]/10 text-center">
          <p class="text-xs text-[#333333]/40 font-['Work_Sans']">
            © 2026 EventsAdmin. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>