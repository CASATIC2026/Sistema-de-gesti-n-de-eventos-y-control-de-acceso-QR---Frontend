<script setup>
import { ref } from "vue";
import { createEvent } from "@/services/eventService";

const name = ref("");
const date = ref("");
const capacity = ref("");

const submit = async () => {
  await createEvent({
    name: name.value,
    eventDate: date.value,
    maxCapacity: parseInt(capacity.value)
  });

  alert("Evento creado");
};
</script>

<template>
  <div class="p-4">
    <input v-model="name" placeholder="Nombre" class="border p-2 block mb-2"/>
    <input v-model="date" type="date" class="border p-2 block mb-2"/>
    <input v-model="capacity" type="number" placeholder="Capacidad" class="border p-2 block mb-2"/>

    <button @click="submit" class="bg-blue-500 text-white p-2">
      Crear
    </button>
  </div>
</template>