<script setup>
import { ref, onMounted, onActivated } from "vue";
import { getEvents } from "@/services/eventService";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

// Ref para almacenar los eventos
const events = ref([]);

// Función para cargar los eventos desde el backend
const loadEvents = async () => {
  try {
    events.value = await getEvents();
  } catch (error) {
    console.error("Error al cargar eventos:", error);
  }
};

const deleteEvent = async (eventId) => {
  const confirmDelete = confirm("¿Segur@ q quieres desactivar este evento?");

  if (!confirmDelete) return;

  try {
    await api.delete(`/event/${eventId}`);

    // recargar lista
    await loadEvents();

  } catch (error) {
    console.error("Error eliminando evento:", error);
    alert("No se pudo eliminar el evento");
  }
};

// Cargar eventos al montar el componente
onMounted(() => {
  loadEvents();
});

//este es cuando regresas a la vista
onActivated(() => {
  loadEvents();
});

// Función para ir a crear un evento
const goToCreate = () => {
  router.push("/admin/events/create");
};

// Función para ir a la lista de tickets de un evento
const goToTickets = (eventId) => {
  router.push(`/admin/tickets/${eventId}`);
};

</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-secondary">Eventos</h1>
        <p class="text-gray-500">Gestiona tus eventos fácilmente</p>
      </div>

      <button @click="goToCreate"
        class="bg-primary hover:opacity-90 text-white px-5 py-2 rounded-lg shadow transition w-full md:w-auto">
        + Nuevo Evento
      </button>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="event in events" :key="event.id"
        class="bg-white rounded-xl p-5 shadow hover:shadow-lg transition border border-gray-100">
        <h2 class="text-lg font-semibold text-secondary">
          {{ event.name }}
        </h2>

        <p class="text-sm text-gray-500 mt-1">
          {{ event.eventDate }}
        </p>

        <div class="mt-3 flex justify-between items-center">
          <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            Cupo: {{ event.maxCapacity }}
          </span>
        </div>

        <div class="mt-4 flex gap-2">
          <button @click="goToTickets(event.id)" 
          class="flex-1 bg-primary text-white py-1.5 rounded hover:opacity-90">
            Ver Tickets
          </button>

          <button @click="router.push(`/admin/events/edit/${event.id}`)"
            class="flex-1 border border-primary text-primary px-3 py-1 rounded">
            Editar
          </button>

          <button @click="deleteEvent(event.id)"
            class="flex-1 border border-red-600 text-red-600 py-1.5 rounded hover:bg-red-600 hover:text-white transition">
            Eliminar
          </button>

        </div>
      </div>
    </div>
  </div>
</template>