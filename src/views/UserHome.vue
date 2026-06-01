<template>

  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

  <div class="bg-surface font-body text-on-surface min-h-screen">
    <nav class="fixed top-0 z-50 w-full glass-nav shadow-[0px_20px_40px_rgba(28,27,27,0.06)]">
      <div class="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
        <div class="text-2xl font-headline font-bold tracking-tighter text-on-surface">
          QRVentus
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="isLoggedIn">
            <span class="font-headline font-bold text-on-surface">{{ userEmail || 'Usuario' }}</span>
            <button @click="logout"
              class="text-[11px] font-label uppercase tracking-widest text-primary hover:underline border border-primary px-3 py-1 rounded-md ml-4 transition-all">Cerrar
              sesión</button>
          </template>
          <template v-else>
            <router-link to="/login"
              class="font-headline font-bold text-primary hover:underline underline-offset-4 scale-95 active:opacity-80 transition-all">Iniciar
              sesión</router-link>
            <router-link to="/register"
              class="gold-gradient text-on-primary px-6 py-2 rounded-xl font-headline font-bold scale-95 active:opacity-80 transition-all">Registrarse</router-link>
          </template>
        </div>
      </div>
    </nav>
    <main class="pt-28 pb-20 px-8 max-w-[1920px] mx-auto">
      <header class="mb-12">
        <h1 class="font-headline text-5xl font-bold text-on-surface mb-2 tracking-tight">QRVentus</h1>
        <p class="text-secondary max-w-2xl text-lg">Encuentra tus eventos favoritos en El Salvador, compra tus boletos y
          disfruta de las mejores experiencias.</p>
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

              <div class="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-sm flex items-center">
                <div class="w-1 h-4 bg-primary mr-2"></div>
                <span class="font-label text-[10px] font-bold uppercase tracking-widest" :class="{
                  'text-green-500': evt.status === 'ACTIVE',
                  'text-red-500': evt.status === 'COMPLETED',
                  'text-yellow-500': evt.status === 'CANCELLED'
                }">
                  {{ evt.status }}
                </span>
              </div>
            </div>
            <div class="pt-6 px-6 pb-6 bg-surface-container-low flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2 gap-4">
                <h3
                  class="font-headline text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {{ evt.name }}</h3>
                <span class="font-headline text-sm font-bold text-primary shrink-0 opacity-80 mt-1">Ver</span>
              </div>
              <div class="flex items-center text-secondary text-sm space-x-4 mt-4">
                <div class="flex items-center">
                  <span class="material-symbols-outlined text-[16px] mr-1">today</span>
                  <span>{{ formatDate(evt.eventDate) }}</span>
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
      <section v-if="isLoggedIn" class="bg-surface-container-low -mx-8 px-8 py-0">
        <div class="max-w-[1920px] mx-auto">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-8">
            <div>
              <span class="font-label uppercase tracking-[0.05rem] text-xs text-secondary mb-1 block">Tus Boletos</span>
              <h2 class="font-headline text-4xl font-bold">Mis Boletos</h2>
            </div>
          </div>

          <div v-if="loadingTickets" class="flex justify-center py-12">
            <p class="text-secondary font-headline animate-pulse">Cargando tus boletos...</p>
          </div>

          <div v-else-if="myTickets.length === 0" class="flex justify-center py-12 text-center text-secondary">
            <div class="flex flex-col items-center gap-4">
              <span class="material-symbols-outlined text-6xl opacity-40">confirmation_number</span>
              <p class="font-headline">No tienes boletos registrados aún.</p>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div v-for="ticket in myTickets" :key="ticket.ticketId || ticket.TicketId"
              class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant/20 hover:border-primary/30">
              <!-- <pre class="text-xs text-white bg-black p-2 rounded">
{{ JSON.stringify(ticket, null, 2) }}
</pre> -->

              <div class="flex flex-col md:flex-row">
                <!-- IMAGEN - Proporción fija y más elegante -->
                <div class="md:w-48 lg:w-64 h-48 md:h-auto bg-surface-container-high relative overflow-hidden">
                  <img v-if="ticket.event?.imageUrl || ticket.Event?.ImageUrl" alt="Event Ticket"
                    class="w-full h-full object-cover md:absolute md:inset-0 transition-transform duration-500 group-hover:scale-105"
                    :src="ticket.event?.imageUrl || ticket.Event?.ImageUrl" />
                  <div v-else
                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high">
                    <span class="material-symbols-outlined text-5xl text-secondary/40">confirmation_number</span>
                  </div>
                </div>

                <!-- CONTENIDO PRINCIPAL -->
                <div class="flex-1 p-5 lg:p-6">
                  <!-- Badges y Ticket ID -->
                  <div class="flex flex-wrap items-center gap-2 mb-4">
                    <span v-if="ticket.isUsed || ticket.IsUsed"
                      class="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-red-500/10 backdrop-blur-sm shadow-sm border border-red-500/20 text-red-600">
                      Utilizado
                    </span>
                    <span v-else-if="(ticket.emailStatus || ticket.EmailStatus) === 'PENDIENTE'"
                      class="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-500/10 backdrop-blur-sm shadow-sm border border-amber-500/20 text-amber-600">
                      Pendiente
                    </span>
                    <span v-else
                      class="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-sm shadow-sm border border-emerald-500/20 text-emerald-600">
                      Confirmado
                    </span>

                    <span class="text-[11px] text-secondary/70 font-mono tracking-wide">ID: #{{ (ticket.ticketId ||
                      ticket.TicketId).substring(0, 8).toUpperCase() }}</span>
                  </div>

                  <!-- Título del evento -->
                  <h3 class="text-xl lg:text-2xl font-bold text-on-surface mb-4 line-clamp-2">
                    {{ (ticket.event || ticket.Event).name || (ticket.event || ticket.Event).Name }}
                  </h3>

                  <!-- Grid de información -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Fecha -->
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-secondary text-base mt-0.5">calendar_today</span>
                      <div>
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-secondary/70">
                          Inicio
                        </p>

                        <p class="text-sm font-medium">
                          {{ formatDate((ticket.event || ticket.Event).startDateTime) }}
                        </p>

                        <p class="text-[11px] font-semibold uppercase tracking-wider text-secondary/70 mt-2">
                          Fin
                        </p>

                        <p class="text-sm font-medium">
                          {{ formatDate((ticket.event || ticket.Event).endDateTime) }}
                        </p>
                      </div>
                    </div>

                    <!-- Estado del evento -->
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-secondary text-base mt-0.5">event_available</span>
                      <div>
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-secondary/70">Estado</p>
                        <p class="text-sm font-bold" :class="(ticket.event || ticket.Event).isActive
                          ? 'text-green-600'
                          : 'text-red-600'">
                          ● {{ (ticket.event || ticket.Event).isActive ? 'ACTIVO' : 'INACTIVO' }}
                        </p>

                        <!-- <pre class="text-xs bg-black text-white p-2 rounded mt-2">
                      {{ JSON.stringify(ticket.event || ticket.Event, null, 2) }}
                    </pre> -->

                      </div>
                    </div>

                    <!-- Registro -->
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-secondary text-base mt-0.5">receipt</span>
                      <div>
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-secondary/70">Registro</p>
                        <p class="text-sm font-medium">{{ formatDate(ticket.createdAt || ticket.CreatedAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!--<div class="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 p-5 border-t md:border-t-0 md:border-l border-outline-variant/15 bg-surface-container/20">
        <div class="w-14 h-14 md:w-20 md:h-20 bg-white rounded-xl shadow-sm flex items-center justify-center p-1.5">
          <img 
            alt="QR" 
            class="w-full h-full object-contain" 
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.ticketId || ticket.TicketId}`" 
          />
        </div>
        <button class="text-xs font-bold uppercase tracking-wide text-secondary hover:text-primary transition-colors flex items-center gap-1.5">
          <span class="material-symbols-outlined text-sm">download</span>
          PDF
        </button>
      </div>
                </div>-->
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
const fetchEvents = async () => {
  try {
    const response = await api.get('/event')
    events.value = response.data.data || []
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