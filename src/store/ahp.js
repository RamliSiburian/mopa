import { createSlice } from "@reduxjs/toolkit";

export const ahpState = createSlice({
  name: "ahp",
  initialState: {
    nilaiAkhir: [],
  },
  reducers: {
    changeNilaiAkhirAHP: (state, action) => {
      state.nilaiAkhir = action.payload;
    },
  },
});

export const { changeNilaiAkhirAHP } = ahpState.actions;

export const getAllDataAHP = (state) => state.ahp.nilaiAkhir;

export default ahpState.reducer;
