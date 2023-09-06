import { createSlice } from '@reduxjs/toolkit';

export const ujiAnovaState = createSlice({
  name: 'ujiAnova',
  initialState: {
    resultData: [],
  },
  reducers: {
    changeDataAnova: (state, action) => {
      const { name, data, pValue } = action.payload;
      const existingDataIndex = state.resultData?.findIndex(
        (item) => item.name === name
      );

      if (existingDataIndex !== -1) {
        state.resultData[existingDataIndex].data = data;
        state.resultData[existingDataIndex].pValue = pValue;
      } else {
        state.resultData.push({ name, data, pValue });
      }
    },
  },
});

export const { changeDataAnova } = ujiAnovaState.actions;

export const getResultDataUji = (state) => state.ujiAnova.resultData;

export default ujiAnovaState.reducer;
