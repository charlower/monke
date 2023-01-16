import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const ipfsSlice = createSlice({
  name: 'ipfs',
  initialState: {
    ipfsResponse: {
      status: null,
      data: {},
    },
  },
  reducers: {
    setIpfs: (state, action) => {
      state.ipfsResponse.status = action.payload.status;
      state.ipfsResponse.data = action.payload.data;
    },
  },
});

export const useIpfs = () => {
  const dispatch = useAppDispatch();

  const setIpfs = (data) => dispatch(ipfsSlice.actions.setIpfs(data));
  const ipfsResponse = useAppSelector((state) => state.ipfs.ipfsResponse);

  return { setIpfs, ipfsResponse };
};

export default ipfsSlice.reducer;
