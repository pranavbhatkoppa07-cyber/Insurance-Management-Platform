import api from "./api";

export const getCustomers = async () => {
  const response = await api.get("/customers");
  return response.data;
};

export const createCustomer = async (customer) => {
  const response = await api.post("/customers", customer);
  return response.data;
};

export const updateCustomer = async (id, customer) => {
  const response = await api.put(`/customers/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};