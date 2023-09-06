import { createSlice } from "@reduxjs/toolkit";
import { getDataPerbandinganCriteriaAhp } from "../../config/perbandinganKkriteriaAhp";

export const dataPerbandinganKriteriaAhpState = createSlice({
  name: "perbandinganKriteriaAhp",
  initialState: {
    dataPerbandinganKriteria: [],
    isLoading: false,
  },
  reducers: {
    loadData: (state, action) => {
      state.dataPerbandinganKriteria = action.payload;
    },
    changeLoadingPerbandinganAhp: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});
export const { loadData, changeLoadingPerbandinganAhp } =
  dataPerbandinganKriteriaAhpState.actions;

export const getAllPerbandinganKriteriaAhp = (state) =>
  state.perbandinganKriteriaAhp;

// ! ------------------ api --------------------------
export const fetchPerbandinganKriteriaAhp = () => (dispatch) => {
  const getData = async () => {
    dispatch(changeLoadingPerbandinganAhp(true));
    try {
      const {
        data: { data },
      } = await getDataPerbandinganCriteriaAhp();
      dispatch(loadData(data));
      dispatch(changeLoadingPerbandinganAhp(false));
    } catch (err) {
      console.error(err);
    }
  };

  getData();
};

export default dataPerbandinganKriteriaAhpState.reducer;
