<script setup>
import { useToast } from "../composables/useToast"

const { toast } = useToast()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="toast.show"
      class="fixed bottom-5 right-5 z-[9999] px-5 py-4 rounded-xl text-white shadow-xl font-medium max-w-sm"
      :class="toast.type === 'success'
        ? 'bg-green-500'
        : 'bg-red-500'"
    >
      {{ toast.message }}
    </div>
  </Transition>
</template>