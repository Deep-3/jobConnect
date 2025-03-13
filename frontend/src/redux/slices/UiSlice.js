import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
      isSidebarOpen: false,
      isLoading:false
    },
    reducers: {
      toggleSidebar: (state) => {
        state.isSidebarOpen = !state.isSidebarOpen;
      },
      toggleLoading: (state) => {
        state.isLoading = !state.isLoading;
      }
    }
  });

  export const {toggleSidebar,toggleLoading}=uiSlice.actions;
  export default uiSlice.reducer;