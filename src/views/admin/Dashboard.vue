<script setup>
import { ref, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import api from "@/services/api";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// stats
const totalEvents = ref(0);
const totalTickets = ref(0);
const usedTickets = ref(0);

// chart
const chartData = ref(null);

const loadDashboard = async () => {
  try {
    // eventos
    const eventsRes = await api.get("/event");
    const events = eventsRes.data.data;

    totalEvents.value = events.filter(e => e.isActive).length;

    let ticketsCount = 0;
    let usedCount = 0;

    const labels = [];
    const data = [];

    // recorrer eventos
    for (let event of events) {
      const res = await api.get(`/ticket/event/${event.id}`);
      const tickets = res.data.data.items;

      const count = tickets.length;
      const used = tickets.filter(t => t.isUsed).length;

      ticketsCount += count;
      usedCount += used;

      labels.push(event.name);
      data.push(count);
    }

    totalTickets.value = ticketsCount;
    usedTickets.value = usedCount;

    // datos gráfica
    chartData.value = {
      labels: labels,
      datasets: [
        {
          label: "Tickets por evento",
          data: data
        }
      ]
    };

  } catch (error) {
    console.error(error);
  }
};

onMounted(loadDashboard);
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-secondary mb-6">
      Dashboard
    </h1>

    <!-- CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

      <div class="bg-white p-6 rounded-xl shadow">
        <p class="text-gray-500">Eventos Activos</p>
        <h2 class="text-3xl font-bold text-primary">
          {{ totalEvents }}
        </h2>
      </div>

      <div class="bg-white p-6 rounded-xl shadow">
        <p class="text-gray-500">Total Asistentes</p>
        <h2 class="text-3xl font-bold text-primary">
          {{ totalTickets }}
        </h2>
      </div>

      <div class="bg-white p-6 rounded-xl shadow">
        <p class="text-gray-500">Entradas Usadas</p>
        <h2 class="text-3xl font-bold text-primary">
          {{ usedTickets }}
        </h2>
      </div>

    </div>

    <!-- GRÁFICA -->
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-4">
        Tickets por evento
      </h2>

      <Bar v-if="chartData" :data="chartData" />
    </div>

  </div>
</template>