import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const contentSlice = createSlice({
  name: 'content',
  initialState: {
    cards: [],
    searchTerm: '',
  },
  reducers: {
    setCards: (state, action) => {
      if (action.payload.isSearch) {
        state.cards = action.payload.data;
      } else {
        state.cards = [...state.cards, ...action.payload.data];
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const useContent = () => {
  const dispatch = useAppDispatch();

  const setCards = (cards) => dispatch(contentSlice.actions.setCards(cards));
  const setSearchTerm = (searchTerm) =>
    dispatch(contentSlice.actions.setSearchTerm(searchTerm));
  const cards = useAppSelector((state) => state.content.cards);
  const searchTerm = useAppSelector((state) => state.content.searchTerm);

  return {
    setCards,
    setSearchTerm,
    cards,
    searchTerm,
  };
};

export default contentSlice.reducer;
