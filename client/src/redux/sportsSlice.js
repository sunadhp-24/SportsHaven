import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sports: [],
};

const sportsSlice = createSlice({
  name: "sportsSlice",
  initialState,
  reducers: {
    setSports: (state, action) => {
      state.sports = [...action.payload];
    },
  },
});

export const { setSports } = sportsSlice.actions;

export default sportsSlice.reducer;
