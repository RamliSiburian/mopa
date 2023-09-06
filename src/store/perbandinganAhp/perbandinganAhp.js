import { createSlice } from "@reduxjs/toolkit";
import { getDataPerbandinganAhp } from "../../config/perbandinganAhp";

export const dataPerbandinganAhpState = createSlice({
  name: "perbandinganAhp",
  initialState: {
    dataPerbandingan: [],
    isLoading: false,
  },
  reducers: {
    loadData: (state, action) => {
      state.dataPerbandingan = action.payload;
    },
    changeLoadingPerbandinganAhp: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});
export const { loadData, changeLoadingPerbandinganAhp } =
  dataPerbandinganAhpState.actions;

export const getAllPerbandinganAhp = (state) => state.perbandinganAhp;

// ! ------------------ api --------------------------
export const fetchPerbandinganAhp = () => (dispatch) => {
  const getData = async () => {
    dispatch(changeLoadingPerbandinganAhp(true));
    try {
      const {
        data: { data },
      } = await getDataPerbandinganAhp();
      dispatch(loadData(data));
      dispatch(changeLoadingPerbandinganAhp(false));
    } catch (err) {
      console.error(err);
    }
  };

  getData();
};

export default dataPerbandinganAhpState.reducer;
