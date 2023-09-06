import { createSlice } from "@reduxjs/toolkit";
import { getDataKriteria } from "../../config/Kriteria";

export const dataKriteriaState = createSlice({
  name: "dataKriteria",
  initialState: {
    datas: [],
    loading: false,
    nextCode: null,
  },
  reducers: {
    loadData: (state, action) => {
      state.datas = action.payload;
    },
    changeLoadingDataKriteria: (state, action) => {
      state.loading = action.payload;
    },
    changeNextCode: (state, action) => {
      state.nextCode = action.payload;
    },
  },
});
export const { loadData, changeLoadingDataKriteria, changeNextCode } =
  dataKriteriaState.actions;

export const getAllDatakriteriaState = (state) => state.dataKriteria;
export const getAllDataKriteria = (state) => state.dataKriteria.datas;

// ! ------------------ api --------------------------
export const fetchDataKriteria = () => (dispatch) => {
  const getData = async () => {
    dispatch(changeLoadingDataKriteria(true));
    try {
      const {
        data: { data },
      } = await getDataKriteria();
      dispatch(loadData(data));
      dispatch(changeLoadingDataKriteria(false));
    } catch (err) {
      console.error(err);
    }
  };

  getData();
};

export default dataKriteriaState.reducer;
