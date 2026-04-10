<template>
  <div class="flex justify-center">

    <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
      {{ successMessage }}
    </div>

    <div class="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">

      <h1 class="text-2xl font-bold text-secondary mb-4">
        Crear Evento
      </h1>

      <div class="space-y-4">

        <!-- NOMBRE -->
        <input v-model="name" placeholder="Nombre" class="w-full border p-3 rounded mb-1" />
        <p v-if="errors.name" class="text-red-500 text-sm mb-2">
          {{ errors.name }}
        </p>

        <!-- DESCRIPCIÓN -->
        <input v-model="description" placeholder="Descripción" class="w-full border p-3 rounded mb-2" />

        <!-- UBICACIÓN -->
        <input v-model="location" placeholder="Ubicación" class="w-full border p-3 rounded mb-1" />
        <p v-if="errors.location" class="text-red-500 text-sm mb-2">
          {{ errors.location }}
        </p>

        <!-- FECHA -->
        <input v-model="date" type="date" class="w-full border p-3 rounded mb-1" />
        <p v-if="errors.date" class="text-red-500 text-sm mb-2">
          {{ errors.date }}
        </p>

        <!-- CAPACIDAD -->
        <input v-model="capacity" type="number" placeholder="Capacidad" class="w-full border p-3 rounded mb-1" />
        <p v-if="errors.capacity" class="text-red-500 text-sm mb-2">
          {{ errors.capacity }}
        </p>

        <!-- BOTONES -->
        <div class="flex gap-2 mt-4">

          <button @click="router.push('/admin/events')" class="flex-1 border p-2 rounded">
            Cancelar
          </button>

          <button @click="submit" class="flex-1 bg-primary text-white p-2 rounded">
            Guardar
          </button>

        </div>
      </div>
    </div>


  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createEvent } from "@/services/eventService";

const router = useRouter();

const successMessage = ref("");

// Campos del formulario como refs
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

// Función para enviar el formulario
const submit = async () => {
  if (!validate()) return;

  await createEvent({
    name: name.value,
    description: description.value,
    location: location.value,
    eventDate: date.value,
    maxCapacity: parseInt(capacity.value)
  });

  successMessage.value = "Evento creado correctamente 🎉";

  setTimeout(() => {
    router.push("/admin/events");
  }, 1500);
};
</script>