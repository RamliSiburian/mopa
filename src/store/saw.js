import { createSlice } from "@reduxjs/toolkit";

export const sawState = createSlice({
  name: "saw",
  initialState: {
    nilaiAkhir: [],
  },
  reducers: {
    changeNilaiAkhirSaw: (state, action) => {
      state.nilaiAkhir = action.payload;
    },
  },
});

export const { changeNilaiAkhirSaw } = sawState.actions;

export const getDataSaw = (state) => state.saw.nilaiAkhir;

export default sawState.reducer;
