<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import * as XLSX from "xlsx"
import api from "../services/api"
//import VueApexCharts from "vue3-apexcharts"

const getEventStatus = (evt) => {
  const now = new Date()
  const eventDate = new Date(evt.eventDate)

  if (eventDate < now) {
    return {
      text: "Finalizado",
      class: "text-error"
    }
  }

  return {
    text: "Activo",
    class: "text-primary"
  }
}

const searchQuery = ref("")

const filteredEvents = computed(() => {
  let filtered = events.value

  // búsqueda
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()

    filtered = filtered.filter(evt =>
      evt.name.toLowerCase().includes(q) ||
      evt.location?.toLowerCase().includes(q)
    )
  }

  // filtros
  if (filterStatus.value === "active") {
    filtered = filtered.filter(evt =>
      new Date(evt.eventDate) > new Date()
    )
  }

  if (filterStatus.value === "finished") {
    filtered = filtered.filter(evt =>
      new Date(evt.eventDate) <= new Date()
    )
  }

  return filtered
})

const filterStatus = ref("all")


const selectedEvent = ref("all")

watch(selectedEvent, async (newVal) => {
  if (newVal === "all") {
    await fetchEventsAndStats()
    await fetchAllTickets()
    return
  }

  await fetchEventStats(newVal)
  await fetchEventTickets(newVal)
})

//función por evento (stats)
const fetchEventStats = async (eventId) => {
  try {
    const res = await api.get(`/event/${eventId}/stats`)
    const s = res.data.data

    stats.value = {
      capacity: s.capacity,
      ticketsRegistered: s.ticketsRegistered,
      checkedIn: s.checkedIn,
      remaining: s.remaining
    }

    chartSeries.value = [
      {
        name: "Personas",
        data: [
          s.ticketsRegistered,
          s.checkedIn,
          s.remaining
        ]
      }
    ]
  } catch (err) {
    console.error(err)
  }
}


//Función tickets por evento
const fetchEventTickets = async (eventId) => {
  try {
    const res = await api.get(`/ticket/event/${eventId}`)

    eventTickets.value =
      res.data.data?.items ||
      res.data.data?.Items ||
      []
  } catch (err) {
    console.error(err)
  }
}


const events = ref([])
//const tickets = ref([])

const loadEvents = async () => {
  try {
    const res = await api.get("/event") // ojo: es /event, no /events

    console.log("EVENTS =>", res.data.data)

    events.value = res.data.data || []
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadEvents()
  fetchEventsAndStats()
  fetchAllTickets()
})


const filteredTickets = computed(() => {
  if (selectedEvent.value === "all") {
    return allTickets.value
  }

  return eventTickets.value
})



 const exportEventSummaryToExcel = async () => {
  const data = []

  for (const evt of eventsList.value) {
    try {
      const res = await api.get(`/ticket/event/${evt.id}`)
      const tickets = res.data.data?.items || res.data.data?.Items || []

      const eventDate = new Date(evt.eventDate)

      const registeredBefore = tickets.filter(t =>
        new Date(t.createdAt) < eventDate
      ).length

      const registeredDay = tickets.filter(t =>
        new Date(t.createdAt).toDateString() === eventDate.toDateString()
      ).length

      const checkedIn = tickets.filter(t => t.isUsed).length
      const notCheckedIn = tickets.length - checkedIn

      data.push({
        Evento: evt.name,
        Fecha: eventDate.toLocaleDateString(),
        Capacidad: evt.maxCapacity,
        Registrados: tickets.length,
        "Antes del evento": registeredBefore,
        "Día del evento": registeredDay,
        "Usaron QR": checkedIn,
        "No asistieron": notCheckedIn,
        "Tasa asistencia": tickets.length
          ? ((checkedIn / tickets.length) * 100).toFixed(1) + "%"
          : "0%"
      })

    } catch (err) {
      console.error(err)
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Resumen Eventos")

  XLSX.writeFile(workbook, "resumen_eventos.xlsx")
}




const exportEventDetailToExcel = () => {
  const data = allTickets.value.map(t => {
    const event = eventsList.value.find(e => e.id === t.eventId)
    const eventDate = event ? new Date(event.eventDate) : null

    const registeredAt = new Date(t.createdAt)

    return {
      Email: t.userEmail,
      Evento: event?.name || "N/A",
      FechaEvento: eventDate ? eventDate.toLocaleDateString() : "N/A",
      FechaRegistro: registeredAt.toLocaleString(),
      "Registrado antes del evento": eventDate
        ? registeredAt < eventDate
        : false,
      "Usó QR": t.isUsed ? "Sí" : "No"
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle Usuarios")

  XLSX.writeFile(workbook, "detalle_usuarios.xlsx")
}



const router = useRouter()
const stats = ref({
  capacity: 0,
  ticketsRegistered: 0,
  checkedIn: 0,
  remaining: 0
})

const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  theme: {
    mode: 'light'
  },
  colors: ['#d5af37'],
  xaxis: {
    categories: ['Registrados', 'Check-In', 'Disponibles']
  }
})

const chartSeries = ref([
  {
    name: 'Personas',
    data: [0, 0, 0]
  }
])



const eventsList = ref([])
const allTickets = ref([])
const fetchEventsAndStats = async () => {

  try {
    const eventsResponse = await api.get('/event')
    eventsList.value = eventsResponse.data.data || []

    if (eventsList.value.length > 0) {
      let totalCapacity = 0
      let totalTickets = 0
      let totalChecked = 0

      for (const evt of eventsList.value) {
        try {
          const res = await api.get(`/event/${evt.id}/stats`)
          const s = res.data.data

          totalCapacity += s.capacity || 0
          totalTickets += s.ticketsRegistered || 0
          totalChecked += s.checkedIn || 0
        } catch (err) {
          console.error(`Error en evento ${evt.id}`, err)
        }
      }

      stats.value = {
        capacity: totalCapacity,
        ticketsRegistered: totalTickets,
        checkedIn: totalChecked,
        remaining: totalCapacity - totalChecked
      }

      chartSeries.value = [
        {
          name: 'Personas',
          data: [
            totalTickets,
            totalChecked,
            totalCapacity - totalChecked
          ]
        }
      ]
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      router.push('/login')
    }
  }
}

const fetchAllTickets = async () => {
  try {
    const eventsResponse = await api.get('/event')
    const events = eventsResponse.data.data || []

    let all = []

    for (const evt of events) {
      try {
        const res = await api.get(`/ticket/event/${evt.id}`)
        const tickets = res.data.data?.items || res.data.data?.Items || []

        all.push(...tickets)
      } catch (err) {
        console.error(`Error loading tickets for event ${evt.id}`)
      }
    }

    allTickets.value = all
  } catch (error) {
    console.error('Failed to fetch all tickets', error)
  }
}


const isModalOpen = ref(false)
const isEditing = ref(false)
const editingEventId = ref(null)
const isMobileMenuOpen = ref(false)
const currentSection = ref('events')
const eventForm = ref({
  name: '',
  eventDate: '',
  location: '',
  description: '',
  maxCapacity: null,
  imageUrl: '',
  isActive: true
})
const submitEvent = async () => {
  try {
    const payload = {
      name: eventForm.value.name,
      description: eventForm.value.description,
      eventDate: eventForm.value.eventDate,
      maxCapacity: eventForm.value.maxCapacity,
      location: eventForm.value.location,
      imageUrl: eventForm.value.imageUrl,
      isActive: eventForm.value.isActive !== undefined ? eventForm.value.isActive : true
    }
    if (isEditing.value) {
      await api.put(`/event/${editingEventId.value}`, payload)
      alert('Evento actualizado exitosamente!')
    } else {
      await api.post('/event', payload)
      alert('Evento creado exitosamente!')
    }

    discardDraft()
    await fetchEventsAndStats()
  } catch (error) {
    console.error("Failed to save event:", error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert("Ocurrió un error. Asegúrate de que la fecha sea futura.")
    }
  }
}
const openEditModal = (evt) => {
  isEditing.value = true
  editingEventId.value = evt.id

  let formattedDate = ''
  if (evt.eventDate) {
    const d = new Date(evt.eventDate)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    formattedDate = `${yyyy}-${mm}-${dd}`
  }
  eventForm.value = {
    name: evt.name,
    eventDate: formattedDate,
    location: evt.location,
    description: evt.description,
    maxCapacity: evt.maxCapacity,
    imageUrl: evt.imageUrl || '',
    isActive: evt.isActive
  }
  isModalOpen.value = true
}
const openCreateModal = () => {
  isEditing.value = false
  editingEventId.value = null
  eventForm.value = {
    name: '',
    eventDate: '',
    location: '',
    description: '',
    maxCapacity: null,
    imageUrl: '',
    isActive: true
  }
  isModalOpen.value = true
}
const isTicketsModalOpen = ref(false)
const eventTickets = ref([])
const selectedEventName = ref('')
const loadingTickets = ref(false)
const openTicketsModal = async (evt) => {
  isTicketsModalOpen.value = true
  selectedEventName.value = evt.name
  loadingTickets.value = true
  eventTickets.value = []
  try {
    const res = await api.get(`/ticket/event/${evt.id}`)
    eventTickets.value = res.data.data?.items || res.data.data?.Items || []
  } catch (error) {
    console.error("Failed to load tickets:", error)
    alert("Error cargando los usuarios.")
  } finally {
    loadingTickets.value = false
  }
}
const closeTicketsModal = () => {
  isTicketsModalOpen.value = false
  eventTickets.value = []
}

const deleteEvent = async (id) => {
  if (confirm("Are you sure you want to disable/delete this event?")) {
    try {
      await api.delete(`/event/${id}`)
      await fetchEventsAndStats()
    } catch (error) {
      console.error("Failed to delete event:", error)
      alert("Failed to delete event.")
    }
  }
}
const discardDraft = () => {
  eventForm.value = {
    name: '',
    eventDate: '',
    location: '',
    description: '',
    maxCapacity: null,
    imageUrl: '',
    isActive: true
  }
  isEditing.value = false
  editingEventId.value = null
  isModalOpen.value = false
}
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

  <div class="bg-surface text-on-surface min-h-screen font-body overflow-hidden flex flex-col">
    <!-- Mobile Menu Overlay -->
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
      class="fixed inset-0 z-30 bg-[#1c1b1b]/60 backdrop-blur-sm lg:hidden transition-opacity"></div>
    <!-- SideNavBar Component -->
    <aside :class="[
      'h-screen w-64 fixed left-0 top-0 bg-[#f6f3f2] flex flex-col py-8 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="px-8 mt-2 lg:mt-0 mb-12 flex justify-between items-center">
        <div>
          <h1 class="font-headline font-bold text-[#1c1b1b] text-xl tracking-tighter">Dashboard</h1>
          <p class="font-headline uppercase tracking-[0.05rem] text-[10px] text-secondary mt-1">Gestión de Eventos</p>
        </div>
        <button @click="isMobileMenuOpen = false" class="lg:hidden text-secondary hover:text-error transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav class="flex-1 space-y-2">
        <a @click="currentSection = 'events'" :class="currentSection === 'events'
          ? 'bg-[#ffffff] text-[#745b00] shadow-sm'
          : 'text-[#656464] hover:bg-[#ebe7e7]'"
          class="rounded-l-xl ml-4 pl-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer">
          <span class="material-symbols-outlined">calendar_today</span>
          <span class="font-headline uppercase tracking-[0.05rem] text-xs font-semibold">Eventos</span>
        </a>
        <a @click="currentSection = 'users'" :class="currentSection === 'users'
          ? 'bg-[#ffffff] text-[#745b00] shadow-sm'
          : 'text-[#656464] hover:bg-[#ebe7e7]'"
          class="rounded-l-xl ml-4 pl-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer">
          <span class="material-symbols-outlined">group</span>
          <span class="font-headline uppercase tracking-[0.05rem] text-xs">Usuarios</span>
        </a>
        <a @click="currentSection = 'analytics'" :class="currentSection === 'analytics'
          ? 'bg-[#ffffff] text-[#745b00] shadow-sm'
          : 'text-[#656464] hover:bg-[#ebe7e7]'"
          class="rounded-l-xl ml-4 pl-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer">
          <span class="material-symbols-outlined">analytics</span>
          <span class="font-headline uppercase tracking-[0.05rem] text-xs">Analíticas</span>
        </a>

        <a @click="currentSection = 'settings'" :class="currentSection === 'settings'
          ? 'bg-[#ffffff] text-[#745b00] shadow-sm'
          : 'text-[#656464] hover:bg-[#ebe7e7]'"
          class="rounded-l-xl ml-4 pl-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer">
          <span class="material-symbols-outlined">settings</span>
          <span class="font-headline uppercase tracking-[0.05rem] text-xs">Configuración</span>
        </a>

      </nav>
      <div class="px-4 mt-8">
        <button @click="openCreateModal"
          class="w-full gold-gradient text-on-primary font-semibold py-4 rounded-xl shadow-lg active:opacity-80 transition-opacity flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">add</span>
          <span class="font-headline uppercase tracking-[0.05rem] text-xs">Crear Evento</span>
        </button>
      </div>
      <div class="mt-auto px-4 space-y-1">
        <a @click.prevent="logout"
          class="text-[#656464] hover:text-error flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200">
          <span class="material-symbols-outlined">logout</span>
          <span class="font-headline uppercase tracking-[0.05rem] text-xs">Cerrar Sesión</span>
        </a>
      </div>
    </aside>
    <!-- Main Content Canvas -->
    <main
      class="flex-1 w-full lg:ml-64 p-4 sm:p-8 lg:p-12 lg:max-w-[calc(100%-16rem)] 2xl:max-w-[1600px] bg-surface min-h-screen overflow-x-hidden">
      <!-- Header Section -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 lg:mb-16">
        <div class="w-full flex items-center justify-between sm:justify-start gap-4">
          <div class="flex items-center gap-3">
            <button @click="isMobileMenuOpen = true"
              class="lg:hidden p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center">
              <span class="material-symbols-outlined">menu</span>
            </button>
            <h2 class="text-2xl sm:text-3xl lg:text-5xl font-bold font-headline tracking-tight text-on-surface">Listado
              de Eventos</h2>
          </div>
          <div class="flex items-center gap-4 sm:hidden">
            <div class="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden">
              <img alt="Admin Avatar" class="w-full h-full object-cover"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDPF3wRBl-HWLIlVrrDH0raZMn-uXXlNp7Tw&s" />
            </div>
          </div>
        </div>
        <div class="hidden sm:flex items-center gap-6">
          <div class="text-right">
            <p class="font-headline font-bold text-on-surface">Eileen Dimas</p>
          </div>
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-surface-container-highest overflow-hidden">
            <img alt="Admin Avatar" class="w-full h-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDPF3wRBl-HWLIlVrrDH0raZMn-uXXlNp7Tw&s" />
          </div>
        </div>
      </header>
      <!-- Stats Bento Grid (Asymmetric) -->

      <!-- Main CRUD Table Section -->
      <!-- EVENTS SECTION -->
      <section v-if="currentSection === 'events'" class="bg-surface-container-low rounded-xl overflow-hidden">
        <div
          class="p-4 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-high/30">
          <h3 class="text-xl font-headline font-bold text-on-surface">Eventos</h3>
          <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div class="relative w-full sm:w-auto">
              <span
                class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
              <input v-model="searchQuery"
                class="pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-lg text-sm font-body w-full sm:w-64 focus:ring-1 focus:ring-primary"
                placeholder="Buscar eventos..." type="text" />
            </div>
            <select v-model="filterStatus"
              class="w-full sm:w-auto bg-surface-container-lowest px-4 py-2 rounded-lg text-xs font-label uppercase tracking-widest text-on-surface hover:bg-white transition-colors focus:ring-1 focus:ring-primary">

              <option value="all">Todos</option>
              <option value="active">Disponibles</option>
              <option value="finished">Finalizados</option>
            </select>
          </div>
        </div>
        <!-- Table -->
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-high/20 border-none">
                <th
                  class="px-4 sm:px-8 py-5 text-[10px] font-label uppercase tracking-widest text-secondary whitespace-nowrap">
                  Detalles del Evento</th>
                <th
                  class="px-4 sm:px-8 py-5 text-[10px] font-label uppercase tracking-widest text-secondary whitespace-nowrap">
                  Fecha</th>
                <th
                  class="px-4 sm:px-8 py-5 text-[10px] font-label uppercase tracking-widest text-secondary whitespace-nowrap">
                  Capacidad</th>
                <th
                  class="px-4 sm:px-8 py-5 text-[10px] font-label uppercase tracking-widest text-secondary text-center whitespace-nowrap">
                  Estado</th>
                <th
                  class="px-4 sm:px-8 py-5 text-[10px] font-label uppercase tracking-widest text-secondary text-right whitespace-nowrap">
                  Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y-0 min-w-max">
              <!-- Event Rows from DB -->
              <tr v-for="evt in filteredEvents" :key="evt.id"
                class="group hover:bg-surface-container-lowest transition-colors border-none">
                <td class="px-4 sm:px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div :class="['hidden sm:block w-1 h-10', evt.isActive ? 'bg-primary' : 'bg-secondary-fixed-dim']">
                    </div>
                    <div>
                      <p class="font-headline font-bold text-on-surface whitespace-nowrap">{{ evt.name }}</p>
                      <p class="text-xs text-secondary font-body whitespace-nowrap">{{ evt.location || 'No Location' }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-4 sm:px-8 py-6 font-body text-sm text-secondary whitespace-nowrap">{{ new
                  Date(evt.eventDate).toLocaleDateString() }}</td>
                <td class="px-4 sm:px-8 py-6 whitespace-nowrap">
                  <span class="text-sm font-body text-on-surface">Max: {{ evt.maxCapacity }}</span>
                </td>
                <td class="px-4 sm:px-8 py-6 font-headline font-bold text-center whitespace-nowrap">
                  <span :class="getEventStatus(evt).class">
                    {{ getEventStatus(evt).text }}
                  </span>
                </td>
                <td class="px-4 sm:px-8 py-6 text-right whitespace-nowrap">
                  <div class="flex justify-end items-center gap-2 lg:group-hover:opacity-100 transition-opacity">
                    <!-- Tickets/Users button -->
                    <button @click.prevent="openTicketsModal(evt)"
                      class="p-2 text-secondary hover:text-primary transition-colors bg-surface-container-lowest lg:bg-transparent rounded-full shadow-sm lg:shadow-none"
                      title="Ver Usuarios">
                      <span class="material-symbols-outlined text-lg sm:text-xl">group</span>
                    </button>
                    <!-- Edit button -->
                    <button @click.prevent="openEditModal(evt)"
                      class="p-2 text-secondary hover:text-primary transition-colors bg-surface-container-lowest lg:bg-transparent rounded-full shadow-sm lg:shadow-none"
                      title="Editar">
                      <span class="material-symbols-outlined text-lg sm:text-xl">edit</span>
                    </button>
                    <!-- Delete button -->
                    <button @click.prevent="deleteEvent(evt.id)"
                      class="p-2 text-secondary hover:text-error transition-colors bg-surface-container-lowest lg:bg-transparent rounded-full shadow-sm lg:shadow-none"
                      title="Eliminar">
                      <span class="material-symbols-outlined text-lg sm:text-xl">delete_outline</span>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty state -->
              <tr v-if="eventsList.length === 0">
                <td colspan="5" class="py-8 text-center text-secondary font-body">No se encontraron eventos.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination-ish Footer -->
        <div
          class="p-4 sm:p-6 bg-surface-container-high/10 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-8 border-t border-outline-variant/10">
          <p class="text-[10px] font-label uppercase tracking-widest text-secondary">Mostrando {{ eventsList.length }}
            Eventos</p>
          <div class="flex gap-2">
            <button class="p-2 text-secondary hover:text-on-surface transition-colors disabled:opacity-30" disabled>
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button class="p-2 text-secondary hover:text-on-surface transition-colors">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
      <!-- ATTENDEES SECTION -->
      <section v-if="currentSection === 'users'" class="space-y-6">

        <!-- HEADER -->
        <div class="flex items-center justify-between">

          <div>
            <h3 class="text-2xl font-bold">
              Asistentes por Evento
            </h3>

            <p class="text-secondary text-sm">
              Control de registros y asistencia
            </p>
          </div>

          <!-- EXPORT BUTTON -->
          <div class="flex gap-2">
  <button @click="exportEventSummaryToExcel"
    class="px-4 py-2 text-xs uppercase bg-primary text-white rounded-lg">
    Exportar resumen
  </button>

  <button @click="exportEventDetailToExcel"
    class="px-4 py-2 text-xs uppercase bg-surface-container-high rounded-lg">
    Exportar detalle
  </button>
</div>

        </div>

        <!-- FILTER -->
        <div>
          <select v-model="selectedEvent" class="p-2 rounded bg-surface-container-low">
            <option value="all">Todos los eventos</option>

            <option v-for="evt in filteredEvents" :key="evt.id" :value="evt.id">
              {{ evt.name }}
            </option>
          </select>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto bg-surface-container-low rounded-xl">

          <table class="w-full">

            <thead>
              <tr class="border-b">
                <th class="text-left p-4">Correo</th>
                <th class="text-center p-4">Evento</th>
                <th class="text-center p-4">Estado</th>
              </tr>
            </thead>

            <tbody>

              <tr v-for="ticket in filteredTickets" :key="ticket.id" class="border-b">

                <td class="p-4">
                  {{ ticket.userEmail }}
                </td>

                <td class="text-center p-4">
                  {{ ticket.eventName }}
                </td>

                <td class="text-center p-4">

                  <span v-if="ticket.isUsed" class="text-green-500 font-semibold">
                    Ingresó
                  </span>

                  <span v-else class="text-yellow-500">
                    Pendiente
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

      <!-- ANALYTICS SECTION -->
      <section v-if="currentSection === 'analytics'" class="space-y-8">
        <div>
          <h2 class="text-3xl font-bold font-headline">
            Analíticas
          </h2>

          <p class="text-secondary mt-2">
            Estadísticas en tiempo real
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Card -->
          <div class="bg-surface-container-low rounded-2xl p-6">
            <p class="text-secondary text-sm mb-2">
              Tickets Registrados
            </p>

            <h2 class="text-5xl font-bold text-primary">
              {{ stats.ticketsRegistered }}
            </h2>
          </div>

          <!-- Card -->
          <div class="bg-surface-container-low rounded-2xl p-6">
            <p class="text-secondary text-sm mb-2">
              Personas Ingresadas
            </p>

            <h2 class="text-5xl font-bold text-green-500">
              {{ stats.checkedIn }}
            </h2>
          </div>

          <!-- Card -->
          <div class="bg-surface-container-low rounded-2xl p-6">
            <p class="text-secondary text-sm mb-2">
              Espacios Disponibles
            </p>

            <h2 class="text-5xl font-bold text-yellow-500">
              {{ stats.remaining }}
            </h2>
          </div>

        </div>

        <!-- Chart -->
        <div class="bg-surface-container-low rounded-2xl p-6">
          <apexchart type="bar" height="350" :options="chartOptions" :series="chartSeries" />
        </div>
      </section>


      <!-- SETTINGS SECTION -->
      <section v-if="currentSection === 'settings'" class="bg-surface-container-low rounded-2xl p-8 space-y-8">
        <div>
          <h3 class="text-2xl font-bold font-headline mb-2">
            Configuración
          </h3>

          <p class="text-secondary">
            Personaliza tu dashboard
          </p>
        </div>

        <!-- Theme -->
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-6">
          <div>
            <h4 class="font-semibold text-on-surface">
              Tema Oscuro
            </h4>

            <p class="text-secondary text-sm">
              Cambiar entre modo claro y oscuro
            </p>
          </div>

          <button class="gold-gradient text-white px-5 py-2 rounded-xl">
            Próximamente
          </button>
        </div>

        <!-- Scanner -->
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-6">
          <div>
            <h4 class="font-semibold text-on-surface">
              Escáner QR
            </h4>

            <p class="text-secondary text-sm">
              Abrir web app del scanner
            </p>
          </div>

          <button class="bg-primary text-white px-5 py-2 rounded-xl">
            Abrir Scanner
          </button>
        </div>

        <!-- Notifications -->
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-on-surface">
              Notificaciones
            </h4>

            <p class="text-secondary text-sm">
              Correos y alertas automáticas
            </p>
          </div>

          <button class="bg-surface-container-high px-5 py-2 rounded-xl">
            Activadas
          </button>
        </div>
      </section>


      <!-- Tickets/Users Modal -->
      <teleport to="body">
        <div v-if="isTicketsModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1c1b1b]/60 backdrop-blur-sm transition-opacity">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col" @click.stop>
            <div
              class="px-6 py-6 sm:px-8 lg:p-8 border-b border-outline-variant/20 flex justify-between items-center bg-white rounded-t-2xl shrink-0">
              <div>
                <h2 class="text-2xl sm:text-3xl font-headline font-bold text-on-surface pr-4">Usuarios Registrados</h2>
                <p class="font-headline uppercase tracking-[0.05rem] text-[10px] text-secondary mt-1">{{
                  selectedEventName }}</p>
              </div>
              <button @click="closeTicketsModal"
                class="text-secondary hover:text-error transition-colors bg-surface-container-lowest p-2 rounded-full lg:p-0 lg:bg-transparent">
                <span class="material-symbols-outlined text-2xl lg:text-2xl">close</span>
              </button>
            </div>

            <div class="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 bg-surface-container-lowest rounded-b-2xl">
              <div v-if="loadingTickets" class="py-12 flex justify-center">
                <p class="text-secondary font-headline animate-pulse">Cargando usuarios...</p>
              </div>
              <div v-else-if="eventTickets.length === 0" class="py-12 flex justify-center">
                <p class="text-secondary font-headline">No hay usuarios registrados aún.</p>
              </div>
              <div v-else class="w-full overflow-x-auto rounded-xl border border-outline-variant/20">
                <table class="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr class="bg-surface-container-high/20 border-none">
                      <th
                        class="px-4 lg:px-6 py-4 text-[10px] font-label uppercase tracking-widest text-secondary whitespace-nowrap">
                        Correo del Usuario</th>
                      <th
                        class="px-4 lg:px-6 py-4 text-[10px] font-label uppercase tracking-widest text-secondary text-center whitespace-nowrap">
                        Estado</th>
                      <th
                        class="px-4 lg:px-6 py-4 text-[10px] font-label uppercase tracking-widest text-secondary text-right whitespace-nowrap">
                        Fecha de Registro</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/10">
                    <tr v-for="ticket in eventTickets" :key="ticket.id || ticket.Id"
                      class="hover:bg-surface-container-low transition-colors">
                      <td class="px-4 lg:px-6 py-4 font-body text-sm font-semibold text-on-surface whitespace-nowrap">{{
                        ticket.userEmail || ticket.UserEmail }}</td>
                      <td class="px-4 lg:px-6 py-4 text-center whitespace-nowrap">
                        <span v-if="ticket.isUsed || ticket.IsUsed"
                          class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-label uppercase tracking-widest rounded-full">Accesado</span>
                        <span v-else
                          class="px-3 py-1 bg-surface-container-high text-secondary text-[10px] font-label uppercase tracking-widest rounded-full">Pendiente</span>
                      </td>
                      <td class="px-4 lg:px-6 py-4 font-body text-sm text-secondary text-right whitespace-nowrap">
                        {{ new Date(ticket.createdAt || ticket.CreatedAt).toLocaleDateString() }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </teleport>
      <!-- New/Edit Event Modal -->
      <teleport to="body">
        <div v-if="isModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1c1b1b]/60 backdrop-blur-sm transition-opacity">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
            <div
              class="px-6 py-6 sm:px-8 lg:p-8 border-b border-outline-variant/20 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 class="text-2xl sm:text-3xl font-headline font-bold text-on-surface">{{ isEditing ? 'Editar Evento' :
                'Crear Evento' }}</h2>
              <button @click="discardDraft"
                class="text-secondary hover:text-error transition-colors bg-surface-container-lowest p-2 rounded-full lg:p-0 lg:bg-transparent">
                <span class="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <form class="p-6 sm:p-8 lg:p-8 space-y-8 lg:space-y-12" @submit.prevent="submitEvent">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <div class="space-y-8">
                  <div class="relative">
                    <label class="block text-[10px] font-label uppercase tracking-widest text-secondary mb-2">Nombre del
                      Evento</label>
                    <input v-model="eventForm.name" required
                      class="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary px-4 py-4 font-body transition-all outline-none rounded-t-lg"
                      placeholder="Nombre del evento" type="text" />
                  </div>
                  <div class="relative">
                    <label
                      class="block text-[10px] font-label uppercase tracking-widest text-secondary mb-2">Fecha</label>
                    <input v-model="eventForm.eventDate" required
                      class="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary px-4 py-4 font-body outline-none rounded-t-lg transition-all"
                      type="date" />
                  </div>
                  <div class="relative">
                    <label
                      class="block text-[10px] font-label uppercase tracking-widest text-secondary mb-2">Lugar</label>
                    <input v-model="eventForm.location" required
                      class="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary px-4 py-4 font-body outline-none rounded-t-lg transition-all"
                      placeholder="Lugar del evento" type="text" />
                  </div>
                  <div class="relative">
                    <label class="block text-[10px] font-label uppercase tracking-widest text-secondary mb-2">URL de la
                      Imagen</label>
                    <input v-model="eventForm.imageUrl"
                      class="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary px-4 py-4 font-body outline-none rounded-t-lg transition-all"
                      placeholder="https://ejemplo.com/imagen.jpg" type="url" />
                  </div>
                </div>
                <!-- Right Col -->
                <div class="space-y-8">
                  <div class="relative">
                    <label
                      class="block text-[10px] font-label uppercase tracking-widest text-secondary mb-2">Descripción</label>
                    <textarea v-model="eventForm.description"
                      class="w-full h-40 bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary px-4 py-4 font-body outline-none rounded-t-lg resize-none transition-all"
                      placeholder="Detalla la experiencia..."></textarea>
                  </div>
                  <div class="relative">
                    <label
                      class="block text-[10px] font-label uppercase tracking-widest text-secondary mb-2">Capacidad</label>
                    <input v-model.number="eventForm.maxCapacity" required min="1"
                      class="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary px-4 py-4 font-body outline-none rounded-t-lg transition-all"
                      placeholder="Total de asistentes" type="number" />
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 lg:pt-8 mt-8 lg:mt-12 border-t border-outline-variant/10">
                <button @click.prevent="discardDraft"
                  class="w-full sm:w-auto px-8 py-3 text-xs font-label uppercase tracking-widest text-secondary hover:bg-surface-container-high rounded-xl transition-colors"
                  type="button">Cancelar</button>
                <button
                  class="w-full sm:w-auto gold-gradient px-8 lg:px-12 py-3 text-on-primary font-bold rounded-xl shadow-lg active:opacity-80 transition-all uppercase tracking-widest text-xs"
                  type="submit">{{ isEditing ? 'Actualizar Evento' : 'Publicar Evento' }}</button>
              </div>
            </form>
          </div>
        </div>
      </teleport>
    </main>
    <!-- Footer Component -->
    <footer
      class="py-8 lg:py-12 px-6 lg:px-8 bg-[#f0edec] lg:ml-64 lg:max-w-[calc(100%-16rem)] 2xl:max-w-[1600px] border-t lg:border-t-0 lg:border-l border-white/50 w-full mt-auto">
      <div
        class="mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 md:gap-0">
        <p class="font-body text-sm text-[#656464]">© 2026 QRVentus. Todos los derechos reservados.</p>
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <a class="text-[#656464] hover:text-[#1c1b1b] transition-all duration-300 hover:underline decoration-[#745b00] underline-offset-4 font-body text-sm"
            href="#">Sobre Nosotros</a>
          <a class="text-[#656464] hover:text-[#1c1b1b] transition-all duration-300 hover:underline decoration-[#745b00] underline-offset-4 font-body text-sm"
            href="#">Contacto</a>
          <a class="text-[#656464] hover:text-[#1c1b1b] transition-all duration-300 hover:underline decoration-[#745b00] underline-offset-4 font-body text-sm"
            href="#">Términos y Condiciones</a>
          <a class="text-[#656464] hover:text-[#1c1b1b] transition-all duration-300 hover:underline decoration-[#745b00] underline-offset-4 font-body text-sm"
            href="#">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  </div>
</template>
<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.gold-gradient {
  background: linear-gradient(135deg, #745b00 0%, #d5af37 100%);
}
</style>