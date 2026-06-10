<script setup>
defineProps({
  selectedEvent: String,
  filteredEvents: Array,
  filteredTickets: Array,
  stats: {
    type: Object,
    default: () => ({
      ticketsRegistered: 0,
      checkedIn: 0,
      remaining: 0
    })
  },
  chartOptions: Object,
  chartSeries: Array,
  exportEventSummaryToExcel: Function,
  exportEventDetailToExcel: Function
})

const emit = defineEmits(["update:selectedEvent"])
</script>

<template>
  <section class="space-y-8">
    <!-- HEADER CON ESTILO -->
    <div class="relative">
     <div class="flex items-center justify-between px-4 pb-2 pt-0 bg-surface-container-low border-b border-outline-variant/20">
        
  
        <h2 class="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-on-surface to-on-surface/70 bg-clip-text text-black tracking-tight">
          Analíticas
        </h2>
        <div class="h-1 w-20 bg-gradient-to-r from-primary to-primary/20 rounded-full mt-3"></div>
        <p class="text-secondary/70 mt-4 text-sm max-w-2xl">
          Estadísticas y métricas en tiempo real de tus eventos
        </p>
      </div>
    </div>
    

    <!-- FILTRO + EXPORTACIÓN - REDISEÑADO -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-surface-container-low/50 backdrop-blur-sm rounded-xl border border-outline-variant/20">
      
      <!-- Selector de evento -->
      <div class="relative flex-1 max-w-xs">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60 text-sm">event</span>
        <select
          :value="selectedEvent"
          @change="emit('update:selectedEvent', $event.target.value)"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
        >
          <option value="all"> Todos los eventos</option>
          <option
            v-for="evt in filteredEvents"
            :key="evt.id"
            :value="evt.id"
          >
             {{ evt.name }}
          </option>
        </select>
        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 text-sm pointer-events-none">expand_more</span>
      </div>

      <!-- Botones de exportación -->
      <div class="flex gap-3">
        <button
          @click="exportEventSummaryToExcel"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <span class="material-symbols-outlined text-sm">download</span>
          Exportar resumen
        </button>

        <!-- <button
          v-if="exportEventDetailToExcel"
          @click="exportEventDetailToExcel"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl transition-all border border-outline-variant/20"
        >
          <span class="material-symbols-outlined text-sm">receipt_long</span>
          Exportar detalle
        </button> -->
      </div>
    </div>

    <!-- TARJETAS DE ESTADÍSTICAS - PREMIUM -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Tickets Registrados -->
      <div class="group relative bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <div class="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-6xl">confirmation_number</span>
        </div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="p-2 bg-primary/10 rounded-xl">
              <span class="material-symbols-outlined text-primary text-xl">confirmation_number</span>
            </div>
            <span class="text-secondary/70 text-xs font-bold uppercase tracking-wider">Registrados</span>
          </div>
          <h2 class="text-5xl md:text-6xl font-bold text-primary font-headline">
            {{ stats.ticketsRegistered }}
          </h2>
          <p class="text-secondary/50 text-xs mt-3">boletos vendidos</p>
        </div>
      </div>

      <!-- Personas Ingresadas -->
      <div class="group relative bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1">
        <div class="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-6xl">how_to_reg</span>
        </div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="p-2 bg-emerald-500/10 rounded-xl">
              <span class="material-symbols-outlined text-emerald-500 text-xl">verified</span>
            </div>
            <span class="text-secondary/70 text-xs font-bold uppercase tracking-wider">Ingresados</span>
          </div>
          <h2 class="text-5xl md:text-6xl font-bold text-emerald-500 font-headline">
            {{ stats.checkedIn }}
          </h2>
          <p class="text-secondary/50 text-xs mt-3">asistentes confirmados</p>
        </div>
      </div>

      <!-- Espacios Disponibles -->
      <div class="group relative bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
        <div class="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-6xl">event_seat</span>
        </div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="p-2 bg-amber-500/10 rounded-xl">
              <span class="material-symbols-outlined text-amber-500 text-xl">event_available</span>
            </div>
            <span class="text-secondary/70 text-xs font-bold uppercase tracking-wider">Disponibles</span>
          </div>
          <h2 class="text-5xl md:text-6xl font-bold text-amber-500 font-headline">
            {{ stats.remaining }}
          </h2>
          <p class="text-secondary/50 text-xs mt-3">lugares libres</p>
        </div>
      </div>
    </div>

    <!-- GRÁFICO - REDISEÑADO -->
    <div class="bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 transition-all duration-300 hover:border-primary/20">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-lg">bar_chart</span>
          <h3 class="text-lg font-bold font-headline text-on-surface">Estadísticas de Eventos</h3>
        </div>
        <div class="flex items-center gap-1 text-secondary/50 text-xs">
          <span class="material-symbols-outlined text-sm">info</span>
          <span>últimos 30 días</span>
        </div>
      </div>
      
      <div class="h-[350px] w-full">
        <apexchart
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </div>

    <!-- TABLA DE TICKETS RECIENTES (OPCIONAL - DESCOMENTAR SI SE NECESITA) -->
    <!--
    <div class="bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20">
      <div class="px-6 py-4 border-b border-outline-variant/20">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-lg">receipt</span>
          <h3 class="text-lg font-bold font-headline text-on-surface">Ingresos Recientes</h3>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-surface-container/50">
            <tr class="border-b border-outline-variant/20">
              <th class="text-left p-4 text-xs font-bold uppercase tracking-wider text-secondary/60">Correo</th>
              <th class="text-left p-4 text-xs font-bold uppercase tracking-wider text-secondary/60">Evento</th>
              <th class="text-center p-4 text-xs font-bold uppercase tracking-wider text-secondary/60">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in filteredTickets.slice(0, 5)" :key="ticket.id" class="border-b border-outline-variant/10 hover:bg-surface-container/30 transition-colors">
              <td class="p-4 text-sm">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-secondary/40 text-sm">mail</span>
                  {{ ticket.userEmail }}
                </div>
              </td>
              <td class="p-4 text-sm">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-secondary/40 text-sm">event</span>
                  {{ ticket.eventName }}
                </div>
              </td>
              <td class="p-4 text-center">
                <span v-if="ticket.isUsed" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                  <span class="material-symbols-outlined text-xs">check_circle</span>
                  Ingresó
                </span>
                <span v-else class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold">
                  <span class="material-symbols-outlined text-xs">schedule</span>
                  Pendiente
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    -->
  </section>
</template>