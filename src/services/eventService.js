import api from './api'

export const getEvents = async () => {
  const res = await api.get("/event");
  return res.data;
};

export const createEvent = async (data) => {
  const res = await api.post("/event", data);
  return res.data;
};