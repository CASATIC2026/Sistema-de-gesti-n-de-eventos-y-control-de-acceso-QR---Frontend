import api from "./api";

export const getEvents = async () => {
  const response = await api.get("/event");
  return response.data.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post("/event", eventData);
  return response.data;
};