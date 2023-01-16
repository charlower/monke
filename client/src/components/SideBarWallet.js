import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { createAvatar } from '@dicebear/avatars';
import { NoEthereumProviderError } from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import * as style from '@dicebear/avatars-identicon-sprites';
import { useAuth } from '../slices/authSlice';
import { useSidebar } from '../slices/sidebarSlice';
import { injected } from '../helpers/connectors';

const SideBarWallet = () => {
  const context = useWeb3React();
  const { authenticating } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const { account, connector, error } = context;

  // handle logic to recognize the wallet type currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const activating = injected === activatingConnector;

  const FlashingLoader = () => {
    return (
      <>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='#198754'
          className='bi bi-brightness-low-fill position-absolute opacity-flash-reverse'
          viewBox='0 0 16 16'
        >
          <path d='M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z' />
        </svg>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='#27e67a'
          className='bi bi-brightness-high-fill position-absolute opacity-flash'
          viewBox='0 0 16 16'
        >
          <path d='M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z' />{' '}
        </svg>
      </>
    );
  };

  let svg = createAvatar(style, {
    seed: account ? account : '',
    dataUri: true,
    width: 50,
  });

  let svgSmall = createAvatar(style, {
    seed: account ? account : '',
    dataUri: true,
    width: 25,
  });

  return isSidebarOpen ? (
    // Sidebar open render starts here
    <div className='mx-5 mt-5' style={{ marginBottom: 26 }}>
      <div className='d-flex justify-content-center m-2'>
        <div
          className={`${
            isSidebarOpen ? 'rounded' : ''
          } bg-secondary bg-gradient p-2 shadow`}
        >
          <img alt='avatar' src={svg} />
        </div>
      </div>
      <div className='d-flex justify-content-center flex-column text-wrap'>
        {account && !authenticating && !activating && !error && (
          <>
            <div className='badge bg-success-pink text-dark align-self-center m-2'>
              Wallet Connected
            </div>
            <small
              className='font-monospace text-secondary text-break align-self-center m-1'
              style={{ fontSize: 12, maxWidth: 155 }}
            >
              {account}
            </small>
          </>
        )}
        {!account && !error && (
          <>
            <div className='badge bg-view-dark text-dark align-self-center m-2'>
              Wallet Not Connected
            </div>
            <small
              className='font-monospace text-secondary text-break align-self-center'
              style={{
                fontSize: 12,
                maxWidth: 155,
                margin: '4px 4px 22px 4px',
              }}
            >
              0x0
            </small>
          </>
        )}
        {activating ||
          (authenticating && (
            <>
              <div className='badge bg-success text-dark align-self-center m-2'>
                Wallet Connecting
              </div>
              <small
                className='font-monospace text-secondary text-break align-self-center m-1'
                style={{ fontSize: 12, maxWidth: 155 }}
              >
                {account}
              </small>
            </>
          ))}
        {error instanceof NoEthereumProviderError ||
        error instanceof UserRejectedRequestErrorInjected ? (
          <>
            <div className='badge bg-view-dark text-dark align-self-center m-2'>
              Wallet Not Connected
            </div>
            <small
              className='font-monospace text-secondary text-break align-self-center'
              style={{
                fontSize: 12,
                maxWidth: 155,
                margin: '4px 4px 22px 4px',
              }}
            >
              0x0
            </small>
          </>
        ) : (
          error && (
            <>
              <div className='badge bg-warning text-dark align-self-center m-2'>
                Unsupported Network
              </div>
              <small
                style={{ fontSize: 12, maxWidth: 155 }}
                className='font-monospace text-secondary text-center text-break align-self-center m-1'
              >
                Please connect to the Optimism network
              </small>
            </>
          )
        )}
      </div>
    </div>
  ) : (
    // Sidebar closed render starts here
    <div className='mt-5 mb-3 me-3'>
      <div className='d-flex justify-content-end m-2'>
        <div className='rounded bg-secondary bg-gradient p-1 shadow'>
          <img alt='avatar' src={svgSmall} />
        </div>
      </div>
      <div
        className='d-flex justify-content-center flex-column text-wrap position-relative'
        style={{ marginRight: '0.65em' }}
      >
        {account && !authenticating && !activating && !error && (
          <>
            <div
              style={{ width: 15, height: 15, marginBottom: 52 }}
              className='rounded-circle bg-success-pink align-self-end mx-2 mt-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
                className='bi bi-check position-absolute'
                viewBox='0 0 16 16'
                fill='#282b35'
              >
                <path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z' />
              </svg>
            </div>
            <small
              className='font-monospace text-secondary text-break align-self-end m-1 text-truncate position-absolute'
              style={{ fontSize: 12, maxWidth: 55, right: -20, top: 30 }}
            >
              {account}
            </small>
          </>
        )}
        {!account && !error && (
          <>
            <div
              style={{ width: 15, height: 15 }}
              className='rounded-circle bg-view-dark align-self-end m-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
                fill='#15161c'
                className='bi bi-emoji-expressionless position-absolute'
                viewBox='0 0 16 16'
              >
                <path d='M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z' />{' '}
              </svg>
            </div>
            <small
              className='font-monospace text-secondary text-break align-self-end'
              style={{
                fontSize: 12,
                maxWidth: 155,
                margin: '4px 4px 22px 4px',
              }}
            >
              0x0
            </small>
          </>
        )}
        {activating ||
          (authenticating && (
            <>
              <div
                style={{ width: 16, height: 16, marginBottom: 51 }}
                className='rounded-circle align-self-end mx-2 mt-2'
              >
                <FlashingLoader />
              </div>
              <small
                className='font-monospace text-secondary text-break align-self-end m-1 text-truncate position-absolute'
                style={{ fontSize: 12, maxWidth: 55, right: -20, top: 30 }}
              >
                {account}
              </small>
            </>
          ))}
        {error instanceof NoEthereumProviderError ||
        error instanceof UserRejectedRequestErrorInjected ? (
          <>
            <div
              style={{ width: 15, height: 15 }}
              className='rounded-circle bg-view-dark align-self-end m-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
                fill='#15161c'
                className='bi bi-emoji-expressionless position-absolute'
                viewBox='0 0 16 16'
              >
                <path d='M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z' />{' '}
              </svg>
            </div>
            <small
              className='font-monospace text-secondary text-break align-self-end'
              style={{
                fontSize: 12,
                maxWidth: 155,
                margin: '4px 4px 22px 4px',
              }}
            >
              0x0
            </small>
          </>
        ) : (
          error && (
            <>
              <div
                style={{ width: 15, height: 15 }}
                className='rounded-circle bg-warning align-self-end m-2'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='15'
                  height='15'
                  fill='#15161c'
                  className='bi bi-emoji-dizzy position-absolute'
                  viewBox='0 0 16 16'
                >
                  <path d='M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z' />{' '}
                </svg>
              </div>
              <small
                style={{ fontSize: 24, maxWidth: 155, margin: '4px 9px 4px' }}
                className='font-monospace text-secondary text-center text-break align-self-end'
              >
                !
              </small>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SideBarWallet;
