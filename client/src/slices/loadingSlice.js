import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    loadingData: false,
  },
  reducers: {
    setLoadingData: (state) => {
      state.loadingData = !state.loadingData;
    },
  },
});

export const useLoading = () => {
  const dispatch = useAppDispatch();

  const setLoadingData = () => dispatch(loadingSlice.actions.setLoadingData());
  const loadingData = useAppSelector((state) => state.loading.loadingData);

  return { setLoadingData, loadingData };
};

export default loadingSlice.reducer;
