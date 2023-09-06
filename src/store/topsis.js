import { createSlice } from "@reduxjs/toolkit";

export const topsisState = createSlice({
  name: "topsis",
  initialState: {
    nilaiAkhir: [],
  },
  reducers: {
    changeNilaiAkhirTopsis: (state, action) => {
      state.nilaiAkhir = action.payload;
    },
  },
});

export const { changeNilaiAkhirTopsis } = topsisState.actions;

export const getDataTopsis = (state) => state.topsis.nilaiAkhir;

export default topsisState.reducer;
