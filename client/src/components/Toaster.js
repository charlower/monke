import { useRef, useEffect } from 'react';
import { Toast } from 'bootstrap';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UnsupportedChainIdError } from '@web3-react/core';

import Logo1 from '../img/monke-logo-1.svg';
import Logo2 from '../img/monke-logo-2.svg';
import Logo3 from '../img/monke-logo-3.svg';
import Logo4 from '../img/monke-logo-4.svg';

import { useWeb3React } from '@web3-react/core';
import { useToast } from '../slices/toastSlice';

const logoArray = [Logo1, Logo2, Logo3, Logo4];
const randomLogo = logoArray[Math.floor(Math.random() * logoArray.length)];

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, please install MetaMask on desktop.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize MONKE to connect with your wallet.';
  } else {
    return 'An unknown error occurred. Check the console for more details.';
  }
}

export const ToastNotification = () => {
  const toastRef = useRef();

  const { error } = useWeb3React();

  useEffect(() => {
    const myToast = toastRef.current;
    let bsToast = Toast.getInstance(myToast);

    if (!bsToast) {
      // initialize Toast
      bsToast = new Toast(myToast, { autohide: false });
      // hide after init
      bsToast.hide();
    } else {
      // toggle
      error ? bsToast.show() : bsToast.hide();
    }
  }, [error]);

  return (
    <>
      <div
        style={{ zIndex: 4 }}
        className='toast-container position-fixed p-3 top-0 start-50 translate-middle-x'
      >
        <div
          ref={toastRef}
          className='toast'
          role='alert'
          aria-live='assertive'
          aria-atomic='true'
        >
          <div
            style={{
              borderBottomColor: 'rgba(0, 0, 0, 0.88)',
            }}
            className='toast-header bg-dark'
          >
            <img
              src={randomLogo}
              style={{ height: 20 }}
              className='me-2'
              alt='Attn'
            />
            <strong className='me-auto text-white-50'>Attention</strong>
            <small className='text-white-50'>Just now</small>
            <button
              type='button'
              className='btn-close btn-close-white'
              data-bs-dismiss='toast'
              aria-label='Close'
            ></button>
          </div>
          <div
            style={{ backgroundColor: '#1d2028' }}
            className='toast-body text-secondary'
          >
            {getErrorMessage(error)}
          </div>
        </div>
      </div>
    </>
  );
};

export const ToastNotificationGeneral = () => {
  const toastRef = useRef();
  const { toastMessage, setToastMessage } = useToast();

  useEffect(() => {
    const generalToast = toastRef.current;
    let bsToast = Toast.getInstance(generalToast);

    if (!bsToast) {
      // initialize Toast
      bsToast = new Toast(generalToast, { autohide: false });
      // hide after init
      bsToast.hide();
    } else {
      // toggle
      toastMessage !== '' ? bsToast.show() : bsToast.hide();
    }
  });

  return (
    <>
      <div
        style={{ zIndex: 2000 }}
        className='toast-container position-fixed p-3 top-0 start-50 translate-middle-x'
      >
        <div
          ref={toastRef}
          className='toast'
          role='alert'
          aria-live='assertive'
          aria-atomic='true'
        >
          <div
            style={{
              borderBottomColor: 'rgba(0, 0, 0, 0.88)',
            }}
            className='toast-header bg-dark'
          >
            <img
              src={randomLogo}
              style={{ height: 20 }}
              className='me-2'
              alt='Attn'
            />
            <strong className='me-auto text-white-50'>Attention</strong>
            <small className='text-white-50'>Just now</small>
            <button
              onClick={() => setToastMessage('')}
              type='button'
              className='btn-close btn-close-white'
              data-bs-dismiss='toast'
              aria-label='Close'
            ></button>
          </div>
          <div
            style={{ backgroundColor: '#1d2028' }}
            className='toast-body text-secondary'
          >
            {toastMessage}
          </div>
        </div>
      </div>
    </>
  );
};
