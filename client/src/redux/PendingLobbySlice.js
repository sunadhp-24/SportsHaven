import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pendingLobbies: [],
  pendingLobby: {},
};

const pendingLobbySlice = createSlice({
  name: "pendinglobbyslice",
  initialState,
  reducers: {
    setPendingLobbies: (state, action) => {
      state.pendingLobbies = [...action.payload];
    },
    setPendingLobby: (state, action) => {
      state.pendingLobby = action.payload;
    },
  },
});

export const { setPendingLobbies, setPendingLobby } = pendingLobbySlice.actions;

export default pendingLobbySlice.reducer;
