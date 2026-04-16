<script setup>
import { ref, onMounted } from 'vue';
import { getEvents } from '@/services/eventService';
import { getMyTickets } from '@/services/ticketService';
import { registerTicket } from "@/services/ticketService";
import api from '@/services/api';

const mobileMenuOpen = ref(false);

const events = ref([]);
const loadingEventId = ref(null)
const myTickets = ref([])
const successMessage = ref("")
const errorMessage = ref("")

const loadMyTickets = async () => {
  try {
    const res = await getMyTickets()
    myTickets.value = res.data || res
  } catch (error) {
    console.error(error)
  }
}

const hasTicket = (eventId) => {
  return myTickets.value.some(t => t.event.eventId === eventId)
}

const loadData = async () => {
  try {
    events.value = await getEvents();
    myTickets.value = await getMyTickets();

    console.log("EVENTS:", events.value); //  aquí
  } catch (error) {
    console.error(error);
  }
};

const handleRegister = async (eventId) => {
  loadingEventId.value = eventId
  successMessage.value = ""
  errorMessage.value = ""

  try {
    await registerTicket(eventId)

    successMessage.value = "Muy bien. Ticket registrado! Revisa tu correo"
    await loadMyTickets()

  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Error al registrar ticket"
  } finally {
    loadingEventId.value = null
  }
}

//onMounted(loadData);
onMounted(() => {
  loadData()
  loadMyTickets()
})
</script>


<template>
  <div class="min-h-screen bg-[#F5F5F5] font-['Work_Sans']">
    
    <!-- Header / Navegación -->
    <header class="bg-[#121212] sticky top-0 z-50 shadow-lg">
      <div class="container mx-auto px-4 md:px-6 py-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <!-- Logo -->
          <div class="flex items-center justify-between">
            <h1 class="text-2xl md:text-3xl font-bold font-['Manrope'] text-[#C5A028] tracking-tight">
             EventsAccess
            </h1>
            <!-- Mobile menu button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-[#F5F5F5]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
          
          <!-- Navigation Links -->
          <nav :class="['md:flex md:items-center md:gap-8', mobileMenuOpen ? 'block' : 'hidden']">
            <div class="flex flex-col md:flex-row gap-4 md:gap-6">
              <a href="#" class="text-[#F5F5F5] hover:text-[#C5A028] transition font-['Work_Sans']">Events</a>
              <a href="#" class="text-[#F5F5F5] hover:text-[#C5A028] transition font-['Work_Sans']">Dashboard</a>
              <a href="#" class="text-[#F5F5F5] hover:text-[#C5A028] transition font-['Work_Sans']">Contact</a>
              <a href="#" class="text-[#F5F5F5] hover:text-[#C5A028] transition font-['Work_Sans']">Login</a>
              <a href="#" class="bg-[#C5A028] text-[#121212] px-5 py-2 rounded-lg font-semibold hover:bg-[#C5A028]/90 transition shadow-lg">
                Register
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-[#121212] to-[#1a1a1a] text-white py-20 md:py-28">
      <div class="container mx-auto px-4 md:px-6 text-center">
        <h2 class="text-4xl md:text-6xl font-bold font-['Manrope'] mb-4 bg-gradient-to-r from-[#C5A028] to-[#C5A028]/60 bg-clip-text text-transparent">
          Curated Experiences
        </h2>
        <p class="text-lg md:text-xl text-[#F5F5F5]/80 max-w-2xl mx-auto font-['Work_Sans']">
          Descubre el acceso exclusivo a los encuentros y eventos culturales más prestigiosos del mundo.
        </p>
      </div>
    </section>

  
    <!-- Featured Events Section -->
    <section class="py-16 md:py-20">
      <div class="container mx-auto px-4 md:px-6">
        
        <div class="flex justify-between items-center mb-10">
          <h3 class="text-2xl md:text-3xl font-bold font-['Manrope'] text-[#333333] border-l-4 border-[#C5A028] pl-4">
            EVENTOS DISPONIBLES
          </h3>
          <span class="text-sm text-[#333333]/60 font-['Work_Sans']">Featured Events</span>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div v-for="event in events" :key="event.id"
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">

    <div class="h-2 bg-gradient-to-r from-[#C5A028] to-[#C5A028]/50"></div>

    <div class="p-6">
      <h4 class="text-xl font-bold text-[#333333] mb-2">
        {{ event.name }}
      </h4>

      <p class="text-sm text-[#333333]/60 mb-4">
        {{ new Date(event.eventDate).toLocaleDateString() }}
      </p>

      <div class="flex items-center gap-2 text-[#333333]/60 mb-4">
        <span>{{ event.location }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-[#C5A028]">
          Cupo: {{ event.maxCapacity }}
        </span>

        <button
          @click="handleRegister(event.id)"
          class="bg-[#C5A028] text-[#121212] px-5 py-2 rounded-lg font-semibold hover:bg-[#C5A028]/90 transition"
        >
          Registrarme
        </button>
      </div>
    </div>

  </div>
</div>

      </div>

        <!--<pre>{{ events[0] }}</pre>-->

    <div v-if="successMessage"
  class="bg-green-100 text-green-700 p-3 rounded mb-4">
  {{ successMessage }}
</div>

<div v-if="errorMessage"
  class="bg-red-100 text-red-700 p-3 rounded mb-4">
  {{ errorMessage }}
</div>

    </section>

    <!-- My Tickets Section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 md:px-6">
        
        <h3 class="text-2xl md:text-3xl font-bold font-['Manrope'] text-[#333333] border-l-4 border-[#C5A028] pl-4 mb-8">
          TU COLECCIÓN
        </h3>

        <div class="flex gap-4 mb-8 border-b border-[#333333]/20">
          <button class="px-6 py-2 text-[#C5A028] border-b-2 border-[#C5A028] font-semibold">My Tickets</button>
          <button class="px-6 py-2 text-[#333333]/60 hover:text-[#333333]">Upcoming</button>
          <button class="px-6 py-2 text-[#333333]/60 hover:text-[#333333]">Past Events</button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">

  <div v-for="ticket in myTickets" :key="ticket.ticketId"
    class="bg-[#F5F5F5] rounded-2xl shadow-md overflow-hidden border border-[#333333]/10">

    <div class="bg-[#C5A028] px-4 py-2 flex justify-between items-center">
      <span class="text-xs font-semibold text-[#121212]">
        {{ ticket.isUsed ? "USADO" : "ACTIVO" }}
      </span>

      <span class="text-xs font-mono text-[#121212]">
        ID: {{ ticket.ticketId }}
      </span>
    </div>

    <div class="p-6">
      <h4 class="text-xl font-bold text-[#333333] mb-4">
        {{ ticket.event.name }}
      </h4>

      <div class="grid grid-cols-2 gap-3 text-sm">

        <div>
          <p class="text-xs text-gray-500">DATE</p>
          <p class="font-semibold">
            {{ new Date(ticket.event.eventDate).toLocaleDateString() }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">STATUS</p>
          <p :class="ticket.isUsed ? 'text-red-500' : 'text-green-600'">
            {{ ticket.isUsed ? "Usado" : "Disponible" }}
          </p>
        </div>

      </div>
    </div>

  </div>

</div>

<p v-if="myTickets.length === 0" class="text-center text-gray-500 mt-6">
  No tienes tickets aún
</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#121212] text-[#F5F5F5]/70 py-12">
      <div class="container mx-auto px-4 md:px-6">
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold font-['Manrope'] text-[#C5A028] mb-2">The Executive Curator</h2>
          <div class="flex flex-wrap justify-center gap-6 text-sm mt-4">
            <a href="#" class="hover:text-[#C5A028] transition">About</a>
            <a href="#" class="hover:text-[#C5A028] transition">Contact</a>
            <a href="#" class="hover:text-[#C5A028] transition">Legal</a>
            <a href="#" class="hover:text-[#C5A028] transition">Privacy Policy</a>
          </div>
        </div>
        
        <div class="text-center text-xs pt-8 border-t border-[#333333]">
          <p>© 2026 The EventAccess. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>



<style scoped>
.container {
  max-width: 1280px;
}
</style>