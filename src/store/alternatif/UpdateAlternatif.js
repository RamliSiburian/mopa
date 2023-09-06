import { createSlice } from "@reduxjs/toolkit";

export const updateAlternatifState = createSlice({
  name: "updateAlternatif",
  initialState: {
    kode: "",
    namaAlternatif: "",
    kodeKriteria: [],
    nilai: [],
  },
  reducers: {
    loadDataAlternatif: (state, action) => {
      const { namaAlternatif, kode, kodeKriteria, nilai } = action.payload;
      state.kode = kode;
      state.namaAlternatif = namaAlternatif;
      state.kodeKriteria = kodeKriteria;
      state.nilai = nilai;
    },
    changeNameAlternatif: (state, action) => {
      state.namaAlternatif = action.payload;
    },
    changeNilaiKriteria: (state, action) => {
      state.nilai = action.payload;
    },
  },
});

export const { loadDataAlternatif, changeNameAlternatif, changeNilaiKriteria } =
  updateAlternatifState.actions;

export const getAllDataEditAlternatif = (state) => state.updateAlternatif;

export default updateAlternatifState.reducer;
