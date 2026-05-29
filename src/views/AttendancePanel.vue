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

  <!-- HEADER -->
  <div>
    <h2 class="text-3xl font-bold font-headline">
      Analíticas
    </h2>

    <p class="text-secondary mt-2">
      Estadísticas en tiempo real
    </p>
  </div>

  <!-- ===================== -->
  <!-- FILTER + EXPORT -->
  <!-- ===================== -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">

    <select
      :value="selectedEvent"
      @change="emit('update:selectedEvent', $event.target.value)"
      class="p-2 rounded bg-surface-container-low"
    >
      <option value="all">Todos los eventos</option>

      <option
        v-for="evt in filteredEvents"
        :key="evt.id"
        :value="evt.id"
      >
        {{ evt.name }}
      </option>
    </select>

    <div class="flex gap-2">
      <button
        @click="exportEventSummaryToExcel"
        class="px-4 py-2 text-xs uppercase bg-primary text-white rounded-lg"
      >
        Exportar resumen
      </button>

      <button
        @click="exportEventDetailToExcel"
        class="px-4 py-2 text-xs uppercase bg-surface-container-high rounded-lg"
      >
        Exportar detalle
      </button>
    </div>

  </div>

  <!-- ===================== -->
  <!-- TABLE (REPORTES ARRIBA) -->
  <!-- ===================== -->
  <!--<div class="overflow-x-auto bg-surface-container-low rounded-xl">

    <table class="w-full">

      <thead>
        <tr class="border-b">
          <th class="text-left p-4">Correo</th>
          <th class="text-center p-4">Evento</th>
          <th class="text-center p-4">Estado</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="border-b"
        >
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

  </div>-->

  <!-- ===================== -->
  <!-- STATS -->
  <!-- ===================== -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

    <div class="bg-surface-container-low rounded-2xl p-6">
      <p class="text-secondary text-sm mb-2">Tickets Registrados</p>
      <h2 class="text-5xl font-bold text-primary">
        {{ stats.ticketsRegistered }}
      </h2>
    </div>

    <div class="bg-surface-container-low rounded-2xl p-6">
      <p class="text-secondary text-sm mb-2">Personas Ingresadas</p>
      <h2 class="text-5xl font-bold text-green-500">
        {{ stats.checkedIn }}
      </h2>
    </div>

    <div class="bg-surface-container-low rounded-2xl p-6">
      <p class="text-secondary text-sm mb-2">Espacios Disponibles</p>
      <h2 class="text-5xl font-bold text-yellow-500">
        {{ stats.remaining }}
      </h2>
    </div>

  </div>

  <!-- ===================== -->
  <!-- CHART -->
  <!-- ===================== -->
  <div class="bg-surface-container-low rounded-2xl p-6">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>

</section>

</template>