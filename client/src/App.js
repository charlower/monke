import { useRef } from 'react';
import { useSidebar } from './slices/sidebarSlice';
import SideBar from './components/SideBar';
import TopNav from './components/TopNav';
import View from './View';
import { ToastNotification } from './components/Toaster';
import { BrowserRouter as Router } from 'react-router-dom';

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = () => {
  const { viewMinWidth } = useSidebar();
  const viewRef = useRef(null);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <ToastNotification />
        <div className='d-flex' id='wrapper'>
          <SideBar viewWidth={viewRef} />
          <div
            ref={viewRef}
            id='page-content-wrapper'
            className='bg-view-dark'
            style={{
              minWidth: viewMinWidth,
              height: '100vh',
            }}
          >
            <TopNav />
            <View />
          </div>
        </div>
      </Router>
    </Web3ReactProvider>
  );
};

export default App;
