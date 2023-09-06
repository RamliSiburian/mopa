import { createSlice } from "@reduxjs/toolkit";

export const mopaState = createSlice({
  name: "mopa",
  initialState: {
    nilaiAkhir: [],
  },
  reducers: {
    changeNilaiAkhirMopa: (state, action) => {
      state.nilaiAkhir = action.payload;
    },
  },
});

export const { changeNilaiAkhirMopa } = mopaState.actions;

export const getAllDataMopa = (state) => state.mopa;
export const getDataMopa = (state) => state.mopa.nilaiAkhir;

export default mopaState.reducer;
