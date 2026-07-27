import api from "./api";

export const downloadReport = async () => {
  const response = await api.get("/reports/pdf", {
    responseType: "blob",
  });

  return response.data;
};