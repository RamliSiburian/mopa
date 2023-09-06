import { createSlice } from "@reduxjs/toolkit";
import { getDataAlternatif } from "../../config/Alternatif";

export const dataAlternatifState = createSlice({
  name: "dataAlternatif",
  initialState: {
    datas: [],
    loading: false,
    nextCode: null,
    joinData: null,
  },
  reducers: {
    loadData: (state, action) => {
      state.datas = action.payload;
    },
    changeLoadingDataAlternatif: (state, action) => {
      state.loading = action.payload;
    },
    changeNextCodeAlternatif: (state, action) => {
      state.nextCode = action.payload;
    },
    changeJoinData: (state, action) => {
      state.joinData = action.payload;
    },
  },
});
export const {
  loadData,
  changeLoadingDataAlternatif,
  changeNextCodeAlternatif,
  changeJoinData,
} = dataAlternatifState.actions;

export const getAllDataAlternatifState = (state) => state.dataAlternatif;

// ! ------------------ api --------------------------
export const fetchDataAlternatif = () => (dispatch) => {
  const getData = async () => {
    dispatch(changeLoadingDataAlternatif(true));
    try {
      const {
        data: { data },
      } = await getDataAlternatif();
      dispatch(loadData(data));
      dispatch(changeLoadingDataAlternatif(false));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(changeLoadingDataAlternatif(false));
    }
  };

  getData();
};

export default dataAlternatifState.reducer;
