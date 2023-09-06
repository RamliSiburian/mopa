import { createSlice } from "@reduxjs/toolkit";

export const updatePerbandinganAhpState = createSlice({
  name: "updateNilaiPerbandinganAhp",
  initialState: {
    kode: "",
    deskripsi: "",
    nilai: 0,
  },
  reducers: {
    loadDataPerbandinganAhp: (state, action) => {
      const { deskripsi, nilai, kode } = action.payload;
      state.kode = kode;
      state.deskripsi = deskripsi;
      state.nilai = nilai;
    },
    changeNilaiPerbandinganAhp: (state, action) => {
      state.nilai = action.payload;
    },
  },
});

export const { loadDataPerbandinganAhp, changeNilaiPerbandinganAhp } =
  updatePerbandinganAhpState.actions;

export const getAllDataEditPerbandinganAhp = (state) =>
  state.updateNilaiPerbandinganAhp;

export default updatePerbandinganAhpState.reducer;
