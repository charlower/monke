import { useSidebar } from '../slices/sidebarSlice';

import SideBarNav from './SideBarNav';
import SideBarWallet from './SideBarWallet';

import Logo1 from '../img/monke-logo-1.svg';
import Logo2 from '../img/monke-logo-2.svg';
import Logo3 from '../img/monke-logo-3.svg';
import Logo4 from '../img/monke-logo-4.svg';

const logoArray = [Logo1, Logo2, Logo3, Logo4];
const randomLogo = logoArray[Math.floor(Math.random() * logoArray.length)];

const SideBar = ({ viewWidth }) => {
  const { isSidebarOpen, sidebarToggle } = useSidebar();

  const toggleSidebar = () => {
    document.body.classList.toggle('sb-sidenav-toggled');
    if (!isSidebarOpen) {
      sidebarToggle(viewWidth.current.offsetWidth);
    } else {
      sidebarToggle(0);
    }
  };

  const logoStyle = {
    fontWeight: 'bold',
    padding: '0px 3px',
    color: '#fff9',
    display: 'inlineBlock',
    border: '3px solid #ffffff94',
    margin: '0.6em',
  };

  return (
    <>
      <div
        className='bg-dark position-fixed'
        id='sidebar-wrapper'
        style={{ zIndex: 3 }}
      >
        <div id='curved-corner-bottom'></div>
        <div id='curved-corner-top'></div>
        <button
          style={{
            position: 'absolute',
            left: 290,
            top: 470,
            zIndex: 999,
            padding: '7px 16px 7px 5px',
          }}
          onClick={toggleSidebar}
          type='button'
          className='rounded-pill btn btn-view-dark d-flex align-items-center side-nav-btn'
        >
          {isSidebarOpen ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              fill='currentColor'
              className='bi bi-chevron-left'
              viewBox='0 0 16 16'
            >
              <path
                fillRule='evenodd'
                d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              fill='currentColor'
              className='bi bi-chevron-right'
              viewBox='0 0 16 16'
            >
              <path
                fillRule='evenodd'
                d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
              />
            </svg>
          )}
        </button>

        {isSidebarOpen ? (
          <div className='sidebar-heading bg-dark text-light'>
            <img alt='Logo' style={{ height: 55 }} src={randomLogo} />
            <span style={logoStyle}>MONKE</span>
          </div>
        ) : (
          <div className='d-flex justify-content-end sidebar-heading bg-dark text-light'>
            <img
              className='m-1'
              alt='Logo'
              style={{ height: 40 }}
              src={randomLogo}
            />
          </div>
        )}

        <SideBarWallet />
        <SideBarNav />
      </div>
    </>
  );
};

export default SideBar;
