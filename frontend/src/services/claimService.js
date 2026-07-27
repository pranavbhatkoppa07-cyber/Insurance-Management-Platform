import api from "./api";

export const getClaims = async () => {
  const response = await api.get("/claims");
  return response.data;
};

export const createClaim = async (claim) => {
  const response = await api.post("/claims", claim);
  return response.data;
};

export const updateClaim = async (id, claim) => {
  const response = await api.put(`/claims/${id}`, claim);
  return response.data;
};

export const deleteClaim = async (id) => {
  const response = await api.delete(`/claims/${id}`);
  return response.data;
};