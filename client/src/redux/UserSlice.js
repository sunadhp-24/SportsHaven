import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    userid: null,
    activeLobby: false, // Ensure this is `activeLobby`
    currentLobby: null,
    username: "",
    profile_pic: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
    },
    updateUser(state, action) {
      state.user.user = { ...state.user.user, ...action.payload };
    },
  },
});

export const { setLogin, setLogout, updateUser } = userSlice.actions;

export default userSlice.reducer;
