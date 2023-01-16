import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    showModal: false,
  },
  reducers: {
    setShowModal: (state) => {
      state.showModal = !state.showModal;
    },
  },
});

export const useModal = () => {
  const dispatch = useAppDispatch();

  const modalToggle = () => dispatch(modalSlice.actions.setShowModal());
  const modalShowing = useAppSelector((state) => state.modal.showModal);

  return { modalToggle, modalShowing };
};

export default modalSlice.reducer;
