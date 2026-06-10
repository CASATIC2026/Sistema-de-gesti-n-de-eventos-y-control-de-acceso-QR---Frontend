<!-- ANALYTICS SECTION -->
<script setup>
import { ref } from "vue"
import VueApexCharts from "vue3-apexcharts"

const stats = ref({
  ticketsRegistered: 120,
  checkedIn: 80,
  remaining: 40
})

const chartOptions = ref({
  chart: {
    id: "analytics-chart"
  },
  xaxis: {
    categories: ["Lun", "Mar", "Mié", "Jue", "Vie"]
  }
})

const chartSeries = ref([
  {
    name: "Check-ins",
    data: [10, 20, 15, 30, 5]
  }
])
</script>

<template>
  <div class="space-y-8">

    <div>
      <h2 class="text-3xl font-bold font-headline">
        Analíticas
      </h2>

      <p class="text-secondary mt-2">
        Estadísticas en tiempo real
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="bg-surface-container-low rounded-2xl p-6">
        <p class="text-secondary text-sm mb-2">
          Tickets Registrados
        </p>

        <h2 class="text-5xl font-bold text-primary">
          {{ stats.ticketsRegistered }}
        </h2>
      </div>

      <div class="bg-surface-container-low rounded-2xl p-6">
        <p class="text-secondary text-sm mb-2">
          Personas Ingresadas
        </p>

        <h2 class="text-5xl font-bold text-green-500">
          {{ stats.checkedIn }}
        </h2>
      </div>

      <div class="bg-surface-container-low rounded-2xl p-6">
        <p class="text-secondary text-sm mb-2">
          Espacios Disponibles
        </p>

        <h2 class="text-5xl font-bold text-yellow-500">
          {{ stats.remaining }}
        </h2>
      </div>

    </div>

    <div class="bg-surface-container-low rounded-2xl p-6">
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>

  </div>
</template>