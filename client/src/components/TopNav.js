import { useCallback, useState } from 'react';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import { ModalMint } from './ModalMint';
import { useModal } from '../slices/modalSlice';
import { useContent } from '../slices/contentSlice';
import { useHistory } from 'react-router-dom';

const TopNav = () => {
  const [isSearching, setIsSearching] = useState(false);
  const { modalToggle } = useModal();
  const { setCards, setSearchTerm, cards } = useContent();
  let history = useHistory();

  const search = async (value) => {
    if (value) {
      try {
        const res = await axios.get(
          `/api/v1/content/cards/${cards.length}/${value}`
        );
        setCards({ data: res.data, isSearch: true });
        setIsSearching(false);
        const { pathname } = window.location;
        if (pathname !== '/') history.push('/');
      } catch (err) {
        console.log(err);
        setIsSearching(false);
      }
    }
    if (!value) {
      try {
        const res = await axios.get(`/api/v1/content/cards/${0}/''`);
        setCards({ data: res.data, isSearch: true });
        setIsSearching(false);
      } catch (err) {
        console.log(err);
        setIsSearching(false);
      }
    }
    setIsSearching(false);
  };

  // eslint-disable-next-line
  const debounceFn = useCallback(_debounce(search, 500), []);

  const handleChange = (e) => {
    setIsSearching(true);
    setSearchTerm(e.target.value);
    debounceFn(e.target.value);
  };

  return (
    <>
      <ModalMint />
      <nav
        className='navbar navbar-expand-sm navbar-blur navbar-light py-4 px-4 px-sm-5 bg-light bg-transparent position-fixed'
        style={{
          width: 'calc(100% - 80px)',
          left: 80,
          zIndex: 2,
        }}
      >
        <div className='container-fluid p-0'>
          <div
            className='position-relative'
            style={{ maxWidth: 505, width: '100%' }}
          >
            <input
              className='form-control me-2 text-light search-input'
              type='search'
              placeholder='Search'
              aria-label='Search'
              onChange={(e) => handleChange(e)}
            />
            {isSearching && (
              <span
                className='spinner-border spinner-border-sm text-light ms-auto position-absolute'
                style={{ top: 10, right: 95 }}
                role='status'
              />
            )}
          </div>
        </div>
      </nav>
      <button
        onClick={modalToggle}
        className='btn btn-sm btn-outline-success-pink btn-mint'
      >
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='currentColor'
            className='bi bi-cloud-plus me-1'
            viewBox='0 0 16 16'
            style={{ marginTop: -2 }}
          >
            <path
              fillRule='evenodd'
              d='M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z'
            />
            <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
          </svg>
          <span>Mint</span>
        </div>
      </button>
    </>
  );
};

export default TopNav;
