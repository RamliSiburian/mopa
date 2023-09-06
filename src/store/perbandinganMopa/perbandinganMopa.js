import { createSlice } from "@reduxjs/toolkit";
import { getDataPerbandinganMopa } from "../../config/perbandinganMopa";

export const dataPerbandinganMopaState = createSlice({
  name: "perbandinganMopa",
  initialState: {
    dataPerbandinganMopa: [],
    isLoading: false,
  },
  reducers: {
    loadData: (state, action) => {
      state.dataPerbandinganMopa = action.payload;
    },
    changeLoadingPerbandinganMopa: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});
export const { loadData, changeLoadingPerbandinganMopa } =
  dataPerbandinganMopaState.actions;

export const getAllPerbandinganMopa = (state) => state.perbandinganMopa;

// ! ------------------ api --------------------------
export const fetchPerbandinganMopa = () => (dispatch) => {
  const getData = async () => {
    dispatch(changeLoadingPerbandinganMopa(true));
    try {
      const {
        data: { data },
      } = await getDataPerbandinganMopa();
      dispatch(loadData(data));
      dispatch(changeLoadingPerbandinganMopa(false));
    } catch (err) {
      console.error(err);
    }
  };

  getData();
};

export default dataPerbandinganMopaState.reducer;
