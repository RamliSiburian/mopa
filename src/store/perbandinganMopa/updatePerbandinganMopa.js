import { createSlice } from "@reduxjs/toolkit";

export const updatePerbandinganMopaState = createSlice({
  name: "updateNilaiPerbandinganMopa",
  initialState: {
    kode: "",
    deskripsi: "",
    nilai: 0,
  },
  reducers: {
    loadDataPerbandinganMopa: (state, action) => {
      const { deskripsi, nilai, kode } = action.payload;
      state.kode = kode;
      state.deskripsi = deskripsi;
      state.nilai = nilai;
    },
    changeNilaiPerbandinganMopa: (state, action) => {
      state.nilai = action.payload;
    },
  },
});

export const { loadDataPerbandinganMopa, changeNilaiPerbandinganMopa } =
  updatePerbandinganMopaState.actions;

export const getAllDataEditPerbandinganMopa = (state) =>
  state.updateNilaiPerbandinganMopa;

export default updatePerbandinganMopaState.reducer;
