import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lobbies: [],
  lobby: {},
};

const lobbySlice = createSlice({
  name: "lobbyslice",
  initialState,
  reducers: {
    setLobbies: (state, action) => {
      state.lobbies = [...action.payload];
    },
    setLobby: (state, action) => {
      state.lobby = action.payload;
    },
    deleteLobby: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task._id !== taskId);
    },
  },
});

export const { setLobbies, setLobby, deleteLobby } = lobbySlice.actions;

export default lobbySlice.reducer;
