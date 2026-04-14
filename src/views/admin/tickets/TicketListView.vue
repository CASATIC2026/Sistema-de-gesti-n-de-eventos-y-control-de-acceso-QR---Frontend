<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getTicketsByEvent } from "@/services/ticketService";

const route = useRoute();
const eventId = route.params.eventId;

const tickets = ref([]);
const pagination = ref({});
const page = ref(1);

const loadTickets = async () => {
  try {
    const res = await getTicketsByEvent(eventId, page.value);
    tickets.value = res.items;
    pagination.value = res.pagination;
  } catch (error) {
    console.error(error);
  }
};

onMounted(loadTickets);
</script>

<template>
  <div>

    <h1 class="text-2xl font-bold mb-4 text-secondary">
      Tickets del Evento
    </h1>

    <!-- TABLA -->
    <div class="bg-white rounded-xl shadow overflow-x-auto">

      <table class="w-full text-sm">

        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-3">Email</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Fecha Registro</th>
          </tr>
        </thead>

        <tbody>

          <!-- Mensaje cuando no hay tickets -->
          <tr v-if="tickets.length === 0">
            <td colspan="3" class="text-center p-4 text-gray-500">
              No hay tickets registrados para este evento
            </td>
          </tr>

          <!-- Filas de tickets -->
          <tr v-for="ticket in tickets" :key="ticket.id" class="border-t">

            <td class="p-3">{{ ticket.userEmail }}</td>

            <td class="p-3">
              <span :class="ticket.isUsed
                ? 'text-red-500 font-semibold'
                : 'text-green-600 font-semibold'">
                {{ ticket.isUsed ? 'Usado' : 'Disponible' }}
              </span>
            </td>

            <td class="p-3">
              {{ new Date(ticket.createdAt).toLocaleString() }}
            </td>

          </tr>
        </tbody>

      </table>

    </div>

    <!-- PAGINACIÓN -->
    <div class="flex justify-between mt-4">

      <button :disabled="!pagination.hasPreviousPage" @click="page--; loadTickets()"
        class="px-3 py-1 border rounded disabled:opacity-50">
        Anterior
      </button>

      <button :disabled="!pagination.hasNextPage" @click="page++; loadTickets()"
        class="px-3 py-1 border rounded disabled:opacity-50">
        Siguiente
      </button>

    </div>

  </div>
</template>