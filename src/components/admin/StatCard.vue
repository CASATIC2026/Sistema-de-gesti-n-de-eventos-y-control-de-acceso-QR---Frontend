<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border-t-4"
       :class="borderColor">

    <p class="text-sm text-gray-500">
      {{ title }}
    </p>

    <p class="text-3xl font-bold mt-2" :class="valueColor">
      {{ value }}
    </p>

    <p class="text-xs text-gray-400 mt-1">
      {{ subtitle }}
    </p>

  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  subtitle: String,
  borderColor: String,
  valueColor: String
})
</script>