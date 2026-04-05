<script setup>
import { onMounted, ref } from "vue";
import { getEvents } from "@/services/eventService";

const events = ref([]);

onMounted(async () => {
  events.value = await getEvents();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Eventos</h1>

    <div v-for="event in events" :key="event.id" class="border p-2 mb-2">
      <p>{{ event.name }}</p>
      <p>{{ event.eventDate }}</p>
    </div>
  </div>
</template>