import { defineStore } from 'pinia'
/*import eventService from '@/services/eventService'*/
import eventService from '@/services/eventService.mock'

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
      } finally {
        this.loading = false
      }
    },

    async createEvent(eventData) {
      this.loading = true
      this.error = null
      try {
        // Mapear nuestro form al formato que espera el backend
        const payload = {
          name: eventData.name,
          description: eventData.description || '',
          eventDate: eventData.eventDate, // antes era date
          maxCapacity: eventData.maxCapacity ? parseInt(eventData.maxCapacity) : 0, // antes era capacity
          location: eventData.location || ''
        }
        const response = await eventService.create(payload)
        this.events.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear evento'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id, eventData) {
      this.loading = true
      this.error = null
      try {
        const payload = {
          name: eventData.name,
          description: eventData.description || '',
          eventDate: eventData.eventDate,
          maxCapacity: eventData.maxCapacity ? parseInt(eventData.maxCapacity) : 0,
          location: eventData.location || ''
        }
        const response = await eventService.update(id, payload)
        const index = this.events.findIndex(e => e.id === id)
        if (index !== -1) {
          this.events[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar evento'
        throw error
      } finally {
        this.loading = false
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
      totalEvents: (state) => state.events.length,
      activeEvents: (state) => state.events.filter(e => {
        // esto es asumiendo que los eventos activos son futuros o no tienen estado
        return new Date(e.eventDate) > new Date()
      }),
      upcomingEvents: (state) => state.events.filter(e => new Date(e.eventDate) > new Date())
    }
  })