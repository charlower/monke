import { useState } from 'react';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useAuth } from './slices/authSlice';
import { useToast } from './slices/toastSlice';
import { useLoading } from './slices/loadingSlice';
import { ToastNotificationGeneral } from './components/Toaster';
import { timeDifference } from './helpers/utilities';

const Profile = () => {
  const { setUserName, userName, species, authenticating, date, token } =
    useAuth();
  const { setToastMessage } = useToast();
  const { loadingData, setLoadingData } = useLoading();
  const context = useWeb3React();
  const { account } = context;

  const [newUserName, setNewUserName] = useState('');

  const createUsername = async () => {
    setLoadingData(true);
    const postData = {
      userName: newUserName,
      walletAddress: account,
    };

    try {
      const res = await axios.post('/api/v1/user/set_username', postData, {
        headers: {
          Authorization: token,
        },
      });
      const { status, message } = res.data;
      if (status === 'success') {
        setUserName(newUserName);
        setToastMessage('Username set as ' + newUserName);
      }
      if (status === 'error') {
        setToastMessage(message);
      }
    } catch (err) {
      setToastMessage('Sorry there was an error, please try again.');
    }
    setLoadingData(false);
  };

  const userNameMessage = () => {
    if (!token) {
      return 'Connect your wallet to choose your username.';
    }
    if (token && userName === '') {
      return "You don't have a username yet, enter one. Keep in mind it can only be set once.";
    }
    if (token && userName !== '') {
      return 'Your username has been set. It cannot be changed.';
    }
  };

  const handleKeyDown = (e) => {
    setNewUserName(e.target.value.replace(/\s/g, ''));
  };

  return (
    <>
      <ToastNotificationGeneral />
      <h5 className='mt-4 text-light'>Profile</h5>
      <div className='row mt-4'>
        <label className='form-label text-white-50 m-t-1'>
          {account ? 'Connected Wallet' : 'No Wallet Connected'}
        </label>
        <small className='text-secondary font-monospace'>
          {account ? account : '0x0'}
        </small>
        <small style={{ fontSize: 10 }} className='text-secondary d-block mt-1'>
          {account && token
            ? 'Account created ' + timeDifference(date)
            : 'Log in to see account details'}
        </small>
        <div className='col-md-6 mt-4'>
          <label htmlFor='user-name' className='form-label text-white-50 m-0'>
            Username
          </label>
          <small
            style={{ fontSize: 12 }}
            className='d-block mb-3 text-secondary'
          >
            {userNameMessage()}
          </small>
          <input
            style={{
              background: '#4c4e5e',
              boxShadow: '0px 1px 2px #0000003d',
              border: 'none',
            }}
            disabled={userName || !token ? true : false}
            type='text'
            className='form-control text-light'
            value={newUserName}
            placeholder={
              authenticating
                ? 'Loading...'
                : userName
                ? userName
                : 'Choose your username'
            }
            id='user-name'
            onChange={(e) => {
              handleKeyDown(e);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 32) {
                e.preventDefault();
                return false;
              }
            }}
          />
          {/*
          ///////////////////// 
            Button starts here
          /////////////////////
          */}
          {!loadingData && !authenticating ? (
            <button
              onClick={(e) => {
                if (!token) return;
                createUsername();
              }}
              disabled={!token || loadingData}
              className={`btn btn-sm btn-outline-light mt-3 + ${
                account && userName === ''
                  ? null
                  : account && userName !== ''
                  ? 'disabled'
                  : 'disabled'
              }`}
            >
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  className='bi bi-pen me-1'
                  viewBox='0 0 16 16'
                  style={{ marginTop: -2 }}
                >
                  <path d='m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z' />{' '}
                </svg>
                <span>Set Username</span>
              </div>
            </button>
          ) : (
            <button className='disabled btn btn-sm btn-outline-light mt-3'>
              {authenticating ? (
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-pen me-1'
                    viewBox='0 0 16 16'
                    style={{ marginTop: -2 }}
                  >
                    <path d='m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z' />{' '}
                  </svg>
                  <span>Set Username</span>
                </div>
              ) : (
                <div>
                  <div
                    className='spinner-border spinner-border-sm text-success-pink me-1'
                    role='status'
                    style={{ marginTop: -1 }}
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                  <span>Loading...</span>
                </div>
              )}
            </button>
          )}
        </div>
        <div className='col-md-6 mt-4'>
          <label htmlFor='species' className='form-label text-white-50 m-0'>
            Species
          </label>
          <small
            style={{ fontSize: 12 }}
            className='d-block mb-3 text-secondary'
          >
            {account
              ? 'What type of MONKE are you? System generated.'
              : 'Connect your wallet to see your species.'}
          </small>
          <input
            style={{
              background: '#4c4e5e',
              boxShadow: '0px 1px 2px #0000003d',
              border: 'none',
            }}
            type='text'
            className='form-control disabled text-light'
            placeholder={authenticating ? 'Loading...' : species}
            id='species'
            disabled
          />
        </div>
      </div>
    </>
  );
};
export default Profile;
