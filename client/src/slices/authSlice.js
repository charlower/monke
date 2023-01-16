import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userName: '',
    species: '',
    date: 0,
    authenticating: false,
    token: null,
  },
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setSpecies: (state, action) => {
      state.species = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setAuthenticating: (state, action) => {
      state.authenticating = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const context = useWeb3React();
  const { account, library, deactivate } = context;

  const setUserName = (userName) =>
    dispatch(authSlice.actions.setUserName(userName));
  const setSpecies = (species) =>
    dispatch(authSlice.actions.setSpecies(species));
  const setDate = (date) => dispatch(authSlice.actions.setDate(date));
  const setAuthenticating = (authenticating) =>
    dispatch(authSlice.actions.setAuthenticating(authenticating));
  const setToken = (token) => dispatch(authSlice.actions.setToken(token));

  // login for web3 wallet
  const loginWeb3 = async () => {
    const checkUserRegistered = async () => {
      try {
        const res = await axios.get(`/api/v1/user/${account}`);
        if (
          typeof res.data.user !== 'undefined' &&
          account === res.data.user.walletAddress
        ) {
          return true;
        } else {
          return registerUser();
        }
      } catch (err) {
        return false;
      }
    };

    const registerUser = async () => {
      try {
        const res = await axios.post('/api/v1/user/register', {
          walletAddress: account,
        });
        if (res.status === 200) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    };

    const handleSignMessage = async (nonce) => {
      const signer = library.getSigner();
      try {
        return await signer.signMessage(
          `Sign this message to log in to Monke. Your unique code is: ${nonce}`
        );
      } catch (err) {
        return err;
      }
    };

    setAuthenticating(true);
    try {
      // check if user is registered; if not, register them.
      await checkUserRegistered();

      // request nonce from backend
      const responseNonce = await axios.get(`/api/v1/user/${account}/nonce`);
      const nonce = responseNonce.data.nonce;

      // sign message
      const signedMessage = await handleSignMessage(nonce);

      // handle user rejecting signature
      if (
        signedMessage.code === 'ACTION_REJECTED' ||
        signedMessage.code === 4001
      ) {
        deactivate();
        setAuthenticating(false);
        return;
      }

      // send signature to backend
      const signedMessageResponse = await axios.post('api/v1/user/signature', {
        walletAddress: account,
        signedMessage,
      });

      const { data } = signedMessageResponse;
      const { user } = data;

      // save JWT
      setToken(data.token);
      // save user data
      setUserName(user.userName);
      setSpecies(user.species);
      setDate(user.date);
      setAuthenticating(false);
    } catch (err) {
      console.log(err);
    }
  };
  const logoutWeb3 = () => {
    setAuthenticating(true);
    setUserName('');
    setSpecies('');
    setDate(0);
    setToken(null);
    setAuthenticating(false);
  };

  const authenticating = useAppSelector((state) => state.auth.authenticating);
  const date = useAppSelector((state) => state.auth.date);
  const species = useAppSelector((state) => state.auth.species);
  const token = useAppSelector((state) => state.auth.token);
  const userName = useAppSelector((state) => state.auth.userName);

  return {
    setUserName,
    setSpecies,
    setDate,
    setAuthenticating,
    loginWeb3,
    logoutWeb3,
    authenticating,
    date,
    species,
    token,
    userName,
  };
};

export default authSlice.reducer;
