import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { NoEthereumProviderError } from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import { useAuth } from '../slices/authSlice';
import { useSidebar } from '../slices/sidebarSlice';
import { NavLink } from 'react-router-dom';
import { injected } from '../helpers/connectors';
import { ReturnIcon } from '../helpers/utilities';

const SideBarNav = () => {
  const context = useWeb3React();
  const { loginWeb3, logoutWeb3, authenticating } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const { activate, deactivate, active, connector, error } = context;

  // handle logic to recognize the wallet type currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // start authentication flow once web3 wallet connected
  // TODO: async was here before
  useEffect(() => {
    if (active) {
      (async function () {
        loginWeb3();
      })();
    }
    if (!active) {
      (async function () {
        logoutWeb3();
      })();
    }
    // eslint-disable-next-line
  }, [active]);

  const activating = injected === activatingConnector;
  const noEthProvider = error instanceof NoEthereumProviderError;
  const userRejected = error instanceof UserRejectedRequestErrorInjected;
  const connected = injected === connector && !noEthProvider && !userRejected;

  return isSidebarOpen ? (
    // Sidebar open starts here
    <div className='list-group list-group-flush'>
      <NavLink
        exact
        to='/'
        className='list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center border-bottom-0'
      >
        <ReturnIcon iconName='bi-columns-gap' margin={3} />
        Feed
      </NavLink>
      <NavLink
        to='/profile'
        className='list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center border-bottom-0'
      >
        <ReturnIcon iconName='bi-person-circle' margin={3} />
        Profile
      </NavLink>
      {!connected && (
        <button
          className='list-group-item list-gro==up-item-action bg-dark text-light d-flex px-4 py-3 align-items-center'
          onClick={() => {
            setActivatingConnector(injected);
            activate(injected);
          }}
        >
          <ReturnIcon iconName='bi-key' margin={3} />
          {activating || authenticating ? (
            <>
              Connecting...
              <span
                className='spinner-border spinner-border-sm text-light ms-auto'
                role='status'
              ></span>
            </>
          ) : (
            'Connect'
          )}
        </button>
      )}
      {connected && (
        <button
          className='list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center'
          onClick={() => {
            setActivatingConnector(null);
            deactivate();
          }}
        >
          <ReturnIcon iconName='bi-box-arrow-right' margin={3} />
          {activating || authenticating ? (
            <>
              Connecting...
              <span
                className='spinner-border spinner-border-sm text-light ms-auto'
                role='status'
              ></span>
            </>
          ) : (
            'Disconnect'
          )}
        </button>
      )}
    </div>
  ) : (
    // Sidebar closed starts here
    <div className='list-group list-group-flush'>
      <NavLink
        className='justify-content-end list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center'
        exact
        to='/'
      >
        <ReturnIcon iconName='bi-columns-gap' margin={1} />
      </NavLink>
      <NavLink
        className='justify-content-end list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center'
        to='/profile'
      >
        <ReturnIcon iconName='bi-person-circle' margin={1} />
      </NavLink>
      {connected && (
        <button
          className='justify-content-end list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center'
          onClick={() => {
            setActivatingConnector(null);
            deactivate();
          }}
        >
          {activating || authenticating ? (
            <>
              <span
                className='spinner-border spinner-border-sm text-light ms-auto'
                style={{ marginRight: '0.6em', marginTop: '0.25em' }}
                role='status'
              ></span>
            </>
          ) : (
            <ReturnIcon iconName='bi-box-arrow-right' margin={1} />
          )}
        </button>
      )}
      {!connected && (
        <button
          className='justify-content-end list-group-item list-group-item-action bg-dark text-light d-flex px-4 py-3 align-items-center'
          onClick={() => {
            setActivatingConnector(injected);
            activate(injected);
          }}
        >
          {activating || authenticating ? (
            <>
              <span
                className='spinner-border spinner-border-sm text-light ms-auto'
                style={{ marginRight: '0.55em', marginTop: '0.25em' }}
                role='status'
              ></span>
            </>
          ) : (
            <ReturnIcon iconName='bi-key' margin={1} />
          )}
        </button>
      )}
    </div>
  );
};

export default SideBarNav;
