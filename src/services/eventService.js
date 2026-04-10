import axios from "axios";

const API_URL = "http://localhost:5255/api/event";

export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData);
  return response.data;
};