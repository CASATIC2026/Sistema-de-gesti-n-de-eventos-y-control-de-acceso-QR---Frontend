import { defineStore } from 'pinia'
import eventService from '@/services/eventService'

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [],
    currentEvent: null,
    loading: false,
    error: null
  }),

   actions: {
    async fetchEvents() {
      this.loading = true
      this.error = null
      try {
        const response = await eventService.getAll()
        this.events = response.data
      } catch (error) {
        this.error = 'Error al cargar eventos'
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    totalEvents: (state) => state.events.length
  }
})