<template>

  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

  <div class="bg-surface font-body text-on-surface min-h-screen">
        <!-- NAVBAR REDISEÑADO CON LOGO -->
<nav class="fixed top-0 z-50 w-full bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
  <div class="flex justify-between items-center w-full px-6 md:px-8 py-3 md:py-4 max-w-[1920px] mx-auto">
    
    <!-- LOGO CON IMAGEN QRVENTUS.JPG -->
    <router-link to="/" class="flex items-center gap-2 group">
      <!-- <img 
        src="/src/views/QRventus.jpg" 
        alt="QRVentus" 
        class="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      /> -->
      <span class="text-xl md:text-2xl font-headline font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight">
        QRVentus
      </span>
    </router-link>

    <!-- MENÚ USUARIO -->
    <div class="flex items-center gap-3 md:gap-4">
      <template v-if="isLoggedIn">
        <div class="flex items-center gap-3 bg-surface-container-lowest/50 rounded-full px-3 py-1.5 border border-outline-variant/20">
          <span class="material-symbols-outlined text-secondary text-sm">account_circle</span>
          <span class="font-medium text-sm text-on-surface hidden sm:inline">{{ userEmail || 'Usuario' }}</span>
        </div>
        <button @click="logout"
          class="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-all px-4 py-1.5 rounded-full border border-primary/30 hover:border-primary/60 hover:bg-primary/5">
          Cerrar sesión
        </button>
      </template>
      <template v-else>
        <router-link to="/login"
          class="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          Iniciar sesión
        </router-link>
        <router-link to="/register"
          class="bg-gradient-to-r from-primary to-primary/80 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105">
          Registrarse
        </router-link>
      </template>
    </div>
  </div>
</nav>

<!-- MAIN CONTENT -->
<main class="pt-28 pb-20 px-6 md:px-8 max-w-[1920px] mx-auto">
  
  <!-- HEADER HERO REDISEÑADO CON LOGO -->
  <header class="mb-12 relative">
    <!-- Fondo decorativo -->
    <div class="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -right-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
    
    <div class="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
  <img 
    src="./QRventus.jpg"
    alt="QRVentus"
    class="h-14 w-14 rounded-xl object-cover shadow-md"
  />


  <div>
    <h1 class="font-headline text-4xl md:text-5xl font-bold text-on-surface tracking-tight leading-none">
      QRVentus
    </h1>

    <p class="text-sm text-secondary mt-1">
      Plataforma de Eventos
    </p>
  </div>
</div>
        <p class="text-secondary/80 max-w-2xl text-base md:text-lg leading-relaxed">
          Encuentra tus eventos favoritos en El Salvador, compra tus boletos y
          disfruta de las mejores experiencias.
        </p>
      </div>
      
      <!-- Badge estadístico opcional -->
      <div class="flex gap-3">
        <div class="bg-surface-container-lowest/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-outline-variant/20 text-center">
          <p class="text-2xl font-bold text-primary">100+</p>
          <p class="text-[10px] font-bold uppercase tracking-wider text-secondary/60">Eventos</p>
        </div>
        <div class="bg-surface-container-lowest/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-outline-variant/20 text-center">
          <p class="text-2xl font-bold text-primary">5k+</p>
          <p class="text-[10px] font-bold uppercase tracking-wider text-secondary/60">Usuarios</p>
        </div>
      </div>
    </div>
  </header>
      <section class="mb-10">
        <div class="flex items-end justify-between mb-8">
          <div>
            <span class="font-label uppercase tracking-[0.05rem] text-xs text-secondary mb-1 block">Eventos
              Destacados</span>
            <h2 class="font-headline text-2xl font-semibold">Eventos Principales</h2>
          </div>
          <div class="flex gap-4">
            <button @click="scrollEvents('left')"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button @click="scrollEvents('right')"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div v-if="loading" class="flex justify-center py-20">
          <p class="text-secondary font-headline animate-pulse">Cargando eventos...</p>
        </div>
        <div v-else-if="events.length === 0" class="flex justify-center py-20">
          <p class="text-secondary font-headline">No hay eventos disponibles.</p>
        </div>
        <div v-else ref="eventsContainer"
          class="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          <div v-for="evt in events" :key="evt.id"
            class="snap-start shrink-0 w-[85vw] sm:w-[350px] lg:w-[400px] h-full group flex flex-col bg-surface-container-lowest overflow-hidden border border-outline-variant/10 rounded-xl">
            <div
              class="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-surface-container-high/50 flex items-center justify-center">
              <img v-if="evt.imageUrl" :alt="evt.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                :src="evt.imageUrl" />
              <span v-else class="material-symbols-outlined text-6xl text-secondary/30">image</span>

              <!-- <div class="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-sm flex items-center">
                <div class="w-1 h-4 bg-primary mr-2"></div>
                <span class="font-label text-[10px] font-bold uppercase tracking-widest" :class="{
                  'text-green-500': evt.status === 'ACTIVE',
                  'text-red-500': evt.status === 'COMPLETED',
                  'text-yellow-500': evt.status === 'CANCELLED'
                }">
                  {{ evt.status }}
                </span>
              </div> -->
            </div>
            <div class="pt-6 px-6 pb-6 bg-surface-container-low flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2 gap-4">
                <h3
                  class="font-headline text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {{ evt.name }}</h3>
                <span class="font-headline text-sm font-bold text-primary shrink-0 opacity-80 mt-1">Ver</span>
              </div>
              <div class="flex items-center text-secondary text-sm space-x-4 mt-4">
                <div class="flex flex-col text-secondary text-sm mt-4">
                  <!--Fecha y hora inicio y fin-->

  <div class="flex items-center">
    <span class="material-symbols-outlined text-[16px] mr-2">
      calendar_today
    </span>
    <span>
      Inicio: {{ formatDateTime(evt.startDateTime) }}
    </span>
  </div>

  <div class="flex items-center">
    <span class="material-symbols-outlined text-[16px] mr-2">
      event
    </span>
    <span>
      Fin: {{ formatDateTime(evt.endDateTime) }}
    </span>
  </div>
</div>

                <div class="flex items-center">
                  <span class="material-symbols-outlined text-[16px] mr-1">group</span>
                  <span>{{ evt.maxCapacity }} max</span>
                </div>
              </div>
              <div class="flex items-center text-secondary text-sm mb-6 mt-2">
                <span class="material-symbols-outlined text-[16px] mr-1">location_on</span>
                <span class="truncate max-w-[200px]" :title="evt.location">{{ evt.location || 'N/A' }}</span>
              </div>

              <div class="mt-auto pt-4 border-t border-outline-variant/10">
                <button @click="buyTicket(evt.id)" :disabled="buyingTicketId === evt.id"
                  class="w-full py-2 text-on-surface font-headline font-semibold flex justify-between items-center group/btn transition-all uppercase tracking-widest text-xs hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  <span>{{ buyingTicketId === evt.id ? 'Procesando...' : 'Obtener Tickets' }}</span>
                  <span
                    class="material-symbols-outlined transition-transform group-hover/btn:translate-x-1 text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="isLoggedIn" class="bg-gradient-to-br from-surface-container-low to-surface-container -mx-8 px-8 py-0">
  <div class="max-w-[1920px] mx-auto">
    <!-- ENCABEZADO CON ESTILO -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <div class="relative">
        <div class="absolute -left-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="inline-flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary text-sm animate-pulse">confirmation_number</span>
            <span class="font-label uppercase tracking-[0.2rem] text-xs text-secondary/80">Colección</span>
          </div>
          <h2 class="font-headline text-4xl md:text-3xl font-bold bg-gradient-to-r from-on-surface to-on-surface/70 bg-clip-text text-black">
            Mis Boletos
          </h2>
          <div class="h-1 w-20 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3"></div>
        </div>
      </div>
      
      <!-- Contador elegante -->
      <div class="flex items-center gap-3 bg-surface-container-lowest/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-outline-variant/20 shadow-sm">
        <span class="material-symbols-outlined text-secondary text-base">inventory_2</span>
        <span class="text-2xl font-bold text-primary">{{ myTickets.length }}</span>
        <span class="text-xs font-medium text-secondary/70 uppercase tracking-wide">{{ myTickets.length === 1 ? 'boleto' : 'boletos' }}</span>
      </div>
    </div>

    <!-- LOADING - con estilo -->
    <div v-if="loadingTickets" class="flex flex-col items-center justify-center py-20">
      <div class="relative">
        <div class="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-xl animate-pulse">confirmation_number</span>
        </div>
      </div>
      <p class="text-secondary/70 mt-4 text-sm font-medium">Cargando tus experiencias...</p>
    </div>

    <!-- EMPTY STATE - con personalidad -->
    <div v-else-if="myTickets.length === 0" class="relative overflow-hidden bg-surface-container-lowest/40 rounded-2xl border-2 border-dashed border-outline-variant/30 py-16 backdrop-blur-sm">
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col items-center justify-center text-center">
        <div class="mb-5 p-5 bg-surface-container-low rounded-full shadow-inner">
          <span class="material-symbols-outlined text-6xl text-secondary/30">confirmation_number</span>
        </div>
        <p class="font-headline text-xl text-on-surface/70 mb-2">Aún no hay boletos</p>
        <p class="text-secondary/60 text-sm">Descubre eventos y asegura tus entradas</p>
      </div>
    </div>

    <!-- LISTA DE BOLETOS - DISEÑO PREMIUM -->
    <div v-else class="space-y-6">
      <div v-for="ticket in myTickets" :key="ticket.ticketId || ticket.TicketId"
        class="group relative bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-outline-variant/20 hover:border-primary/40 hover:scale-[1.01]">
        
        <!-- Efecto de brillo elegante al hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        
        <!-- Borde decorativo superior -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 group-hover:via-primary transition-all duration-500"></div>

        <div class="flex flex-col md:flex-row">
          <!-- IMAGEN - con efectos mejorados -->
          <div class="md:w-48 lg:w-64 h-48 md:h-auto bg-gradient-to-br from-surface-container to-surface-container-high relative overflow-hidden">
            <img v-if="ticket.event?.imageUrl || ticket.Event?.ImageUrl" alt="Event Ticket"
              class="w-full h-full object-cover md:absolute md:inset-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              :src="ticket.event?.imageUrl || ticket.Event?.ImageUrl" />
            <div v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high">
              <span class="material-symbols-outlined text-6xl text-secondary/30 transition-transform duration-300 group-hover:scale-110">confirmation_number</span>
            </div>
            
            <!-- Overlay elegante en imagen -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Badge flotante en imagen (ID) -->
            <!-- <div class="absolute bottom-3 left-3 md:bottom-4 md:left-4">
              <div class="backdrop-blur-md bg-black/50 rounded-lg px-2.5 py-1 shadow-lg">
                <span class="text-white/90 text-[9px] font-mono font-bold tracking-tight">#{{ (ticket.ticketId || ticket.TicketId).substring(0, 8).toUpperCase() }}</span>
              </div>
            </div> -->
          </div>

          <!-- CONTENIDO PRINCIPAL - más elegante -->
          <div class="flex-1 p-5 lg:p-6">
            <!-- Badges rediseñados -->
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <!-- Estado del ticket con iconos -->
              <div v-if="ticket.isUsed || ticket.IsUsed"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 shadow-sm">
                <span class="material-symbols-outlined text-red-500 text-sm">check_circle</span>
                <span class="text-[11px] font-bold uppercase tracking-wider text-red-600">Utilizado</span>
              </div>
              
              <div v-else-if="(ticket.emailStatus || ticket.EmailStatus) === 'PENDIENTE'"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 shadow-sm">
                <span class="material-symbols-outlined text-amber-500 text-sm">schedule</span>
                <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pendiente</span>
              </div>
              
              <div v-else
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 shadow-sm">
                <!--<span class="material-symbols-outlined text-emerald-500 text-sm">verified</span>-->
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Confirmado</span>
              </div>

              <!-- Estado del evento elegante -->
              <div :class="(ticket.event || ticket.Event).isActive
                ? 'bg-green-500/10 border-green-500/20 text-green-600'
                : 'bg-red-500/10 border-red-500/20 text-red-600'"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm border shadow-sm">
                <!--<span class="material-symbols-outlined text-sm">{{ (ticket.event || ticket.Event).isActive ? 'bolt' : 'block' }}</span>-->
                <span class="text-[11px] font-bold uppercase tracking-wider">{{ (ticket.event || ticket.Event).isActive ? 'Activo' : 'Inactivo' }}</span>
              </div>
            </div>

            <!-- Título del evento con efecto hover -->
            <h3 class="text-xl lg:text-2xl font-bold text-on-surface mb-5 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {{ (ticket.event || ticket.Event).name || (ticket.event || ticket.Event).Name }}
            </h3>

            <!-- Grid de información rediseñado -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <!-- Fecha Inicio -->
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container/20 group-hover:bg-surface-container/40 transition-all duration-300">
                <div class="p-1.5 bg-primary/10 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-sm">calendar_today</span>
                </div>
                <div class="flex-1">
                  <p class="text-[10px] font-black uppercase tracking-wider text-secondary/60">Inicio</p>
                  <p class="text-sm font-semibold text-on-surface">{{ formatDate((ticket.event || ticket.Event).startDateTime) }}</p>
                  <p class="text-[10px] font-black uppercase tracking-wider text-secondary/60 mt-2">Fin</p>
                  <p class="text-sm font-semibold text-on-surface">{{ formatDate((ticket.event || ticket.Event).endDateTime) }}</p>
                </div>
              </div>

              <!-- Estado del evento (versión mejorada) -->
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container/20 group-hover:bg-surface-container/40 transition-all duration-300">
                <div class="p-1.5 bg-primary/10 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-sm">event_available</span>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-wider text-secondary/60">Estado Evento</p>
                  <div class="flex items-center gap-1.5 mt-1">
                    <div :class="(ticket.event || ticket.Event).isActive ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full animate-pulse"></div>
                    <p class="text-sm font-bold" :class="(ticket.event || ticket.Event).isActive ? 'text-green-600' : 'text-red-600'">
                      {{ (ticket.event || ticket.Event).isActive ? 'DISPONIBLE' : 'FINALIZADO' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Registro -->
              <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container/20 group-hover:bg-surface-container/40 transition-all duration-300">
                <div class="p-1.5 bg-primary/10 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-sm">receipt_long</span>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-wider text-secondary/60">Registro</p>
                  <p class="text-sm font-semibold text-on-surface">{{ formatDate(ticket.createdAt || ticket.CreatedAt) }}</p>
                  <p class="text-[10px] text-secondary/50 mt-1">Fecha de registro</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- SECCIÓN QR Y PDF (comentada pero lista para usar) -->
          <!--
          <div class="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 p-5 border-t md:border-t-0 md:border-l border-outline-variant/15 bg-gradient-to-br from-surface-container/30 to-transparent">
            <div class="w-14 h-14 md:w-20 md:h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105">
              <img alt="QR" class="w-full h-full object-contain" 
                :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.ticketId || ticket.TicketId}`" />
            </div>
            <button class="text-xs font-bold uppercase tracking-wide text-secondary hover:text-primary transition-all duration-300 flex items-center gap-1.5 hover:gap-2">
              <span class="material-symbols-outlined text-sm">download</span>
              PDF
            </button>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
    <footer class="w-full py-12 px-8 bg-surface-container border-t border-outline-variant/10">
      <div class="flex flex-col md:flex-row justify-between items-center max-w-[1920px] mx-auto gap-8">
        <div class="font-headline font-bold text-on-surface">QRVentus</div>
        <div class="flex flex-wrap justify-center gap-8 text-sm font-body text-secondary">
          <a class="hover:text-primary hover:underline decoration-primary underline-offset-4 transition-all"
            href="#">Sobre
            Nosotros</a>
          <a class="hover:text-primary hover:underline decoration-primary underline-offset-4 transition-all"
            href="#">Contacto</a>
          <a class="hover:text-primary hover:underline decoration-primary underline-offset-4 transition-all"
            href="#">Legal</a>
          <a class="hover:text-primary hover:underline decoration-primary underline-offset-4 transition-all"
            href="#">Política de Privacidad</a>
        </div>
        <p class="text-sm text-secondary">© 2026 QRVentus. Todos los derechos reservados.</p>
      </div>
    </footer>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-8 right-8 z-50 animate-bounce">
      <div
        :class="['px-6 py-4 rounded-xl shadow-lg font-headline font-bold text-white flex items-center gap-3', toast.type === 'success' ? 'bg-primary' : 'bg-red-500']">
        <span class="material-symbols-outlined">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import img from "./QRventus.jpg";

const router = useRouter()
const events = ref([])
const loading = ref(true)
const eventsContainer = ref(null)
const scrollEvents = (direction) => {
  if (!eventsContainer.value) return
  const card = eventsContainer.value.firstElementChild
  if (!card) return

  const scrollAmount = card.offsetWidth + 32 // ancho de la tarjeta + gap (32px = gap-8)

  if (direction === 'left') {
    eventsContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    eventsContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}
// Control de autenticación de usuario
const isLoggedIn = ref(false)
const userEmail = ref('')
const myTickets = ref([])
const loadingTickets = ref(false)
const checkAuth = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
  if (token) {
    userEmail.value = localStorage.getItem('email') || ''
    if (!userEmail.value) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        userEmail.value = payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.unique_name || ''
      } catch (e) {
        console.error('Error al decodificar token', e)
      }
    }
  }
}
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('email')
  isLoggedIn.value = false
  userEmail.value = ''
  myTickets.value = []
}
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}
const buyingTicketId = ref(null)
const buyTicket = async (eventId) => {
  if (!isLoggedIn.value) {
    showToast('Debes iniciar sesión para obtener boletos', 'error')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return
  }

  if (buyingTicketId.value) return
  buyingTicketId.value = eventId

  try {
    const response = await api.post('/ticket/register', { eventId })
    showToast(response.data.message || 'Registro exitoso, revisa tu correo', 'success')
    fetchMyTickets() // update user's tickets
  } catch (error) {
    console.error('Error al registrar boleto:', error)
    const errorMsg = error.response?.data?.message || 'Hubo un error al registrar el boleto.'
    showToast(errorMsg, 'error')
  } finally {
    buyingTicketId.value = null
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''

  return new Date(dateString).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchEvents = async () => {
  try {
    const response = await api.get('/event')

    const now = new Date()

    events.value = (response.data.data || []).filter(evt => {
      return new Date(evt.endDateTime) >= now
    })

  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}
const fetchMyTickets = async () => {
  if (!isLoggedIn.value) return;

  loadingTickets.value = true;
  try {
    const response = await api.get('/ticket/my-tickets')
    myTickets.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching my tickets:', error)
  } finally {
    loadingTickets.value = false
  }
}
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: '2-digit' }
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', options)
}
onMounted(() => {
  checkAuth()
  fetchEvents()
  fetchMyTickets()
})

function isEventActive(evt) {
  return new Date(evt.eventDate) > new Date()
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>