import api from "./api";

export const getPolicies = async () => {
  const response = await api.get("/policies");
  return response.data;
};

export const createPolicy = async (policy) => {
  const response = await api.post("/policies", policy);
  return response.data;
};

export const updatePolicy = async (id, policy) => {
  const response = await api.put(`/policies/${id}`, policy);
  return response.data;
};

export const deletePolicy = async (id) => {
  const response = await api.delete(`/policies/${id}`);
  return response.data;
};