let events = [
  { id: 1, name: 'Evento Demo', eventDate: '2026-03-10', location: 'San Salvador', maxCapacity: 100 },
  { id: 2, name: 'Evento Prueba', eventDate: '2026-04-01', location: 'Online', maxCapacity: 0 }
];

export default {
  async getAll() {
    return { data: events };
  },
  async getById(id) {
    return { data: events.find(e => e.id === id) };
  },
  async create(data) {
    const newEvent = { id: Date.now(), ...data };
    events.push(newEvent);
    return { data: newEvent };
  },
  async update(id, data) {
    events = events.map(e => e.id === id ? { id, ...data } : e);
    return { data: events.find(e => e.id === id) };
  },
  async delete(id) {
    events = events.filter(e => e.id !== id);
    return { data: true };
  }
};