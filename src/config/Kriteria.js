import { API } from "./API";

export const getDataKriteria = () => API.get("kriteria");
export const getCodes = () => API.post("kriteria/lastCode");
export const createKriteria = (params) => API.post("kriteria", params);
export const deleteKriteria = (kode) => API.delete(`kriteria/delete/${kode}`);
export const updateKriteria = (kode, params) =>
  API.patch(`kriteria/edit/${kode}`, params);
