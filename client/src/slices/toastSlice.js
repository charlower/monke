import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toastMessage: '',
  },
  reducers: {
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
  },
});

export const useToast = () => {
  const dispatch = useAppDispatch();

  const setToastMessage = (toastMessage) =>
    dispatch(toastSlice.actions.setToastMessage(toastMessage));
  const toastMessage = useAppSelector((state) => state.toast.toastMessage);

  return { setToastMessage, toastMessage };
};

export default toastSlice.reducer;
