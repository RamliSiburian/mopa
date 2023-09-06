import { API } from "./API";

export const getDataPerbandinganCriteriaAhp = () =>
  API.get("perbandinganCriteriaAhp");
export const createPerbandinganCriteriaAhp = (params) =>
  API.post("perbandinganCriteriaAhp", params);
// export const getCodes = () => API.post("kriteria/lastCode");
export const deleteDataPerbandinganCriteriaAhp = (kode) =>
  API.delete(`perbandinganCriteriaAhp/delete/${kode}`);
export const updateDataPerbandinganCriteriaAhp = (kode, params) =>
  API.patch(`perbandinganCriteriaAhp/edit/${kode}`, params);
