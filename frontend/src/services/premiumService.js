import api from "./api";

export const getPremiums = async () => {
  const response = await api.get("/premiums");
  return response.data;
};

export const createPremium = async (premium) => {
  const response = await api.post("/premiums", premium);
  return response.data;
};

export const updatePremium = async (id, premium) => {
  const response = await api.put(`/premiums/${id}`, premium);
  return response.data;
};

export const deletePremium = async (id) => {
  const response = await api.delete(`/premiums/${id}`);
  return response.data;
};