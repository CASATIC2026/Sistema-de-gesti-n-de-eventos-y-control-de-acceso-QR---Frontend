<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from "@/services/api";

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const name = ref("");
const description = ref("");
const location = ref("");
const date = ref("");
const capacity = ref("");

const errors = ref({});

const validate = () => {
  errors.value = {};

  if (!name.value) {
    errors.value.name = "El nombre es obligatorio";
  }

  if (!date.value) {
    errors.value.date = "La fecha es obligatoria";
  } else if (new Date(date.value) < new Date()) {
    errors.value.date = "La fecha no puede ser pasada";
  }

  if (!capacity.value) {
    errors.value.capacity = "Capacidad requerida";
  }

  if (!location.value) {
    errors.value.location = "Ubicación requerida";
  }

  return Object.keys(errors.value).length === 0;
};

onMounted(async () => {
  try {
    const res = await api.get(`/event/${id}`);
    const event = res.data;

    name.value = event.name;
    description.value = event.description;
    location.value = event.location;
    date.value = event.eventDate.split("T")[0];
    capacity.value = event.maxCapacity;
  } catch (error) {
    console.error(error);
  }
});

const updateEvent = async () => {
  if (!validate()) return;

  await api.put(`/event/${id}`, {
    name: name.value,
    description: description.value,
    location: location.value,
    eventDate: date.value,
    maxCapacity: parseInt(capacity.value)
  });

  router.push("/admin/events");
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">

    <h2 class="text-2xl font-bold mb-6 text-secondary">
      Editar Evento
    </h2>

    <div class="bg-white p-6 rounded-xl shadow space-y-4">

      <!-- NOMBRE -->
      <input v-model="name" placeholder="Nombre"
        class="w-full border p-3 rounded"/>
      <p v-if="errors.name" class="text-red-500 text-sm">
        {{ errors.name }}
      </p>

      <!-- DESCRIPCIÓN -->
      <textarea v-model="description" placeholder="Descripción"
        class="w-full border p-3 rounded"></textarea>

      <!-- FECHA -->
      <input v-model="date" type="date"
        class="w-full border p-3 rounded"/>
      <p v-if="errors.date" class="text-red-500 text-sm">
        {{ errors.date }}
      </p>

      <!-- UBICACIÓN -->
      <input v-model="location" placeholder="Ubicación"
        class="w-full border p-3 rounded"/>
      <p v-if="errors.location" class="text-red-500 text-sm">
        {{ errors.location }}
      </p>

      <!-- CAPACIDAD -->
      <input v-model="capacity" type="number" placeholder="Capacidad"
        class="w-full border p-3 rounded"/>
      <p v-if="errors.capacity" class="text-red-500 text-sm">
        {{ errors.capacity }}
      </p>

      <!-- BOTONES -->
      <div class="flex gap-2 mt-4">
        
        <button
          @click="router.push('/admin/events')"
          class="flex-1 border p-2 rounded"
        >
          Cancelar
        </button>

        <button
          @click="updateEvent"
          class="flex-1 bg-primary text-white p-2 rounded"
        >
          Guardar Cambios
        </button>

      </div>

    </div>

  </div>
</template>