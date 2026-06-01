<script setup>
import { useToast } from "../composables/useToast"

const { toast } = useToast()
</script>

<template>
  <div
    v-if="toast.show"
    class="fixed bottom-5 right-5 px-4 py-3 rounded-xl text-white shadow-lg"
    :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
  >
    {{ toast.message }}
  </div>
</template>