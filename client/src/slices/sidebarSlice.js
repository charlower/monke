import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarOpen: false,
    viewMinWidth: 280,
  },
  reducers: {
    sidebarToggle: (state, action) => {
      state.sidebarOpen = !state.sidebarOpen;
      state.viewMinWidth = action.payload;
    },
  },
});

export const useSidebar = () => {
  const dispatch = useAppDispatch();

  const sidebarToggle = (width) =>
    dispatch(sidebarSlice.actions.sidebarToggle(width));

  const isSidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);
  const viewMinWidth = useAppSelector((state) => state.sidebar.viewMinWidth);

  return { sidebarToggle, isSidebarOpen, viewMinWidth };
};

export default sidebarSlice.reducer;
