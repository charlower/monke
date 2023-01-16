import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../slices/modalSlice';
import authReducer from '../slices/authSlice';
import sidebarReducer from '../slices/sidebarSlice';
import loadingReducer from '../slices/loadingSlice';
import toastReducer from '../slices/toastSlice';
import ipfsReducer from '../slices/ipfsSlice';
import contentReducer from '../slices/contentSlice';

export default configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    sidebar: sidebarReducer,
    loading: loadingReducer,
    toast: toastReducer,
    ipfs: ipfsReducer,
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
