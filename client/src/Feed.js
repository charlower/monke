import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import { Card, CardLoading } from './components/Card';
import { LoaderLogo } from './components/LoaderLogo';
import { useLoading } from './slices/loadingSlice';
import { useContent } from './slices/contentSlice';
import { ToastNotificationGeneral } from './components/Toaster';
import { useModal } from './slices/modalSlice';

const Feed = () => {
  const { loadingData, setLoadingData } = useLoading();
  const { modalShowing } = useModal();
  const { setCards, cards, searchTerm } = useContent();
  const scrollRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const scrollLoad = () => {
    const scrollPoint =
      scrollRef.current?.getBoundingClientRect().bottom - 0.05;

    if (
      scrollPoint < window.innerHeight ||
      scrollPoint < document.body.offsetHeight ||
      scrollPoint < document.documentElement.offsetHeight
    ) {
      setIsFetching(true);
    }
  };

  const getCards = async () => {
    setLoadingData();
    let search_query = searchTerm !== '' ? searchTerm : "''";
    try {
      const res = await axios.get(
        `/api/v1/content/cards/${cards.length}/${search_query}`
      );
      setCards({ data: res.data, isSearch: false });
      setLoadingData();
      setIsFetching(false);
    } catch (err) {
      console.log(err);
      setLoadingData();
    }
  };

  useEffect(() => {
    getCards();
    window.addEventListener('scroll', scrollLoad);
    return () => window.removeEventListener('scroll', scrollLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetching === true) {
      getCards();
      // eslint-disable-next-line
      _debounce(getCards, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return (
    <>
      <ToastNotificationGeneral />
      {loadingData && !modalShowing && <LoaderLogo />}
      <div ref={scrollRef} className='row mt-4'>
        {loadingData &&
          !modalShowing &&
          cards.length === 0 &&
          [...Array(12)].map((x, i) => <CardLoading key={i} />)}
        {cards.map((card, i) => (
          <Card
            _id={card._id}
            key={`nft-card-${i}`}
            title={card.title}
            author={card.userName[0]}
            avatar={card.mintedBy}
            desc={card.description}
            cost={card.nftCost}
            dateCreated={card.date}
            imgSrc={`https://gateway.pinata.cloud/ipfs/${card.ipfsHash}`}
          />
        ))}
      </div>
    </>
  );
};
export default Feed;
