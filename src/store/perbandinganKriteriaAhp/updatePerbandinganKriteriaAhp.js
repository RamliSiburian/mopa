import { createSlice } from "@reduxjs/toolkit";

export const updatePerbandinganKriteriaAhpState = createSlice({
  name: "updateNilaiPerbandinganKriteriaAhp",
  initialState: {
    kode: "",
    deskripsi: "",
    nilai: 0,
  },
  reducers: {
    loadDataPerbandinganKriteriaAhp: (state, action) => {
      const { deskripsi, nilai, kode } = action.payload;
      state.kode = kode;
      state.deskripsi = deskripsi;
      state.nilai = nilai;
    },
    changeNilaiPerbandinganKriteriaAhp: (state, action) => {
      state.nilai = action.payload;
    },
  },
});

export const {
  loadDataPerbandinganKriteriaAhp,
  changeNilaiPerbandinganKriteriaAhp,
} = updatePerbandinganKriteriaAhpState.actions;

export const getAllDataEditPerbandinganKriteriaAhp = (state) =>
  state.updateNilaiPerbandinganKriteriaAhp;

export default updatePerbandinganKriteriaAhpState.reducer;
