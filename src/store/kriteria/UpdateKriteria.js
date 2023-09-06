import { createSlice } from "@reduxjs/toolkit";

export const updateKriteriaState = createSlice({
  name: "updateKriteria",
  initialState: {
    kode: "",
    namaKriteria: "",
    bobot: 0,
    kategori: "Benefit",
  },
  reducers: {
    loadDataKriteria: (state, action) => {
      const { namaKriteria, bobot, kategori, kode } = action.payload;
      state.kode = kode;
      state.namaKriteria = namaKriteria;
      state.bobot = bobot;
      state.kategori = kategori;
    },
    changeNameKriteria: (state, action) => {
      state.namaKriteria = action.payload;
    },
    changeBobotKriteria: (state, action) => {
      state.bobot = action.payload;
    },
    changeKategoryKriteria: (state, action) => {
      state.kategori = action.payload;
    },
  },
});

export const {
  loadDataKriteria,
  changeNameKriteria,
  changeBobotKriteria,
  changeKategoryKriteria,
} = updateKriteriaState.actions;

export const getAllDataEditKriteria = (state) => state.updateKriteria;

export default updateKriteriaState.reducer;
