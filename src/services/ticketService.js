import api from "./api";

export const getTicketsByEvent = async (eventId, page = 1) => {
  const res = await api.get(`/ticket/event/${eventId}?page=${page}&pageSize=10`);
  return res.data.data;
};