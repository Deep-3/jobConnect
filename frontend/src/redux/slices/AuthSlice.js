import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    User: null
  },
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUser: (state, action) => {
      state.User = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.User = null;
    }
  }
});
export const { setLogin, setUser, logout } = authSlice.actions;
export default authSlice.reducer;