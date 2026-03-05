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
        this.error = error.response?.data?.message || 'Error al cargar eventos'
        console.error(error)
      }
    },

    async deleteEvent(id) {
      this.loading = true
      this.error = null
      try {
        await eventService.delete(id)
        this.events = this.events.filter(e => e.id !== id)
      } catch (error) {
        this.error = 'Error al eliminar evento'
        throw error
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    totalEvents: (state) => state.events.length
  }
})