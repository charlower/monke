import { useEffect, useState } from 'react';
import axios from 'axios';
import { createAvatar } from '@dicebear/avatars';
import { useContent } from './slices/contentSlice';
import { useAuth } from './slices/authSlice';
import { eth_usd as returnEthUsd, timeDifference } from './helpers/utilities';
import { useWeb3React } from '@web3-react/core';
import TokenIcon from './components/TokenIcon';
import LightBox from './components/Lightbox';
import * as style from '@dicebear/avatars-identicon-sprites';

const Comment = ({ userName, walletAddress, comment, date }) => {
  let svgSmall = createAvatar(style, {
    seed: walletAddress,
    dataUri: true,
    width: 25,
  });

  return (
    <div className='nft_comments-comment'>
      <div className='nft_comments-comment-user'>
        <div
          style={{ width: 33 }}
          className='rounded bg-secondary bg-gradient p-1 shadow'
        >
          <img alt='avatar' src={svgSmall} />
        </div>
        <div className='d-flex flex-column'>
          <h6 className='text-white-50'>@{userName}</h6>
          <small
            style={{
              fontSize: '0.7rem',
              marginLeft: '0.56rem',
              marginTop: '1px',
            }}
            className='text-secondary ms-2'
          >
            {timeDifference(date)}
          </small>
        </div>
      </div>
      <div className='nft_comments-comment-content'>{comment}</div>
    </div>
  );
};

const Nft = () => {
  const [data, setData] = useState({});
  const [ethUsd, setEthUsd] = useState();
  const [c2a, setC2a] = useState('');
  const [comment, setComment] = useState();
  const [commentLoading, setCommentLoading] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const context = useWeb3React();
  const { token, userName: commenterName } = useAuth();
  const { account } = context;
  const {
    _id,
    date,
    description,
    title,
    ipfsHash,
    nftCost,
    mintedBy,
    userName,
    type,
    comments,
  } = data;
  const { cards } = useContent();
  let svg = createAvatar(style, {
    seed: mintedBy,
    dataUri: true,
    width: 35,
  });

  useEffect(() => {
    const queryString = window.location.hash;
    const id = queryString.split('#/nft?id=')[1];
    const isIOS =
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    setIsIOS(isIOS);
    if (cards.length > 0) {
      // eslint-disable-next-line
      cards.find((el) => {
        if (el._id === id) {
          setData(el);
        }
      });
    } else {
      async function getCard() {
        const res = await axios.get(`/api/v1/content/card/${id}`);
        setData(res.data);
      }
      getCard();
    }

    async function fetchEthUsd() {
      const ethUsd = await returnEthUsd();
      setEthUsd(ethUsd.data?.data.rates.USD);
    }
    fetchEthUsd();

    const c2aList = [
      'What do you think about this?',
      'How does this make you feel?',
      'What does this make you think about?',
      'Want to say something?',
      'What do you think when you look at this?',
      'Any words for the artist?',
    ];
    const randomC2a = c2aList[Math.floor(Math.random() * c2aList.length)];
    setC2a(randomC2a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function makeComment() {
    setCommentLoading(true);
    const newComments = await axios.post('/api/v1/content/comment', {
      comment,
      commentFrom: account,
      commenterName,
      nftId: _id,
    });
    setData({ ...data, comments: newComments.data.comments });
    setCommentLoading(false);
  }

  return (
    <>
      <div className='nft align-items-center d-flex gap-4'>
        <div className='nft-image'>
          {ipfsHash && type !== 'video/webm' && (
            <LightBox src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}>
              <img
                alt='nft'
                src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              />
            </LightBox>
          )}
          {ipfsHash && type === 'video/webm' && !isIOS && (
            <video className='web-m-video' controls={true} playsInline={true}>
              <source
                src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                type='video/webm'
              />
              <p>
                Your browser doesn't support HTML video. Here is a
                <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}>
                  link to the video
                </a>{' '}
                instead.
              </p>
            </video>
          )}
          {type === 'video/webm' && isIOS && (
            <div className='card__img d-flex align-items-center justify-content-center'>
              <p style={{ padding: '0 2rem', color: '#f8f9fa' }}>
                Sorry, we dont support WEBM on iOS. Browse MONKE on a desktop or
                android device.{' '}
                <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}>
                  Heres a link to the video
                </a>
                .
              </p>
            </div>
          )}
        </div>
        <div className='nft_details'>
          {title ? <h1> {title} </h1> : <div className='card-loading-l' />}
          {description ? (
            <p>{description}</p>
          ) : (
            <div className='card-loading-s mt-3 mb-2' />
          )}
          <div className='nft_creator'>
            {mintedBy ? (
              <div
                style={{ width: 43 }}
                className='rounded bg-secondary bg-gradient p-1 shadow'
              >
                <img alt='avatar' src={svg} />
              </div>
            ) : (
              <div
                style={{ width: 45 }}
                className='card__body-header-avatar mt-2'
              >
                <div className='rounded h-100 p-1 shadow bg-gradient avatar-loading' />
              </div>
            )}
            <div className='nft_creator-name'>
              <small className='text-secondary'>Minted by</small>
              <h6 className='text-white-50'>
                {userName ? '@' + userName : '...'}
              </h6>
            </div>
          </div>
          <div className='nft_price'>
            <h6 className='mb-1'>Purchase</h6>
            <div className='nft_price-detail'>
              <TokenIcon ticker='eth' height={30} styles />
              {nftCost ? (
                <h2>{nftCost && nftCost} ETH</h2>
              ) : (
                <div
                  className='card-loading-l ms-2'
                  style={{ maxWidth: 100 }}
                />
              )}
            </div>
            {ethUsd && nftCost ? (
              <h3>${Number(ethUsd * nftCost).toLocaleString()}</h3>
            ) : (
              <div
                className='card-loading-s mt-2 mb-2'
                style={{ maxWidth: 137 }}
              />
            )}
            <h6 className='mb-1 mt-4'>Created</h6>
            {date ? (
              <h3 style={{ fontWeight: 'normal', marginBottom: 0 }}>
                {timeDifference(date)}
              </h3>
            ) : (
              <div className='card-loading-s mt-1' style={{ maxWidth: 100 }} />
            )}
          </div>
          <div className='nft_buy'>
            <button
              disabled={true}
              type='button'
              className='btn btn-bg btn- w-100 btn-outline-light mt-5'
              onClick={() => console.log('purchase coming soon.')}
            >
              Buy NFT
            </button>
            <small>Buy coming soon</small>
          </div>
        </div>
      </div>
      <div className='nft_comments'>
        <div className='form-floating mb-3'>
          <textarea
            className='form-control text-light'
            value={comment}
            placeholder={c2a}
            onChange={(e) => setComment(e.target.value)}
            style={{
              backgroundColor: 'rgb(29, 32, 40)',
              border: 'none',
            }}
          />
          <label className='text-white-50' htmlFor='descriptionInput'>
            {c2a}
          </label>
        </div>
        <button
          disabled={!token || commentLoading}
          type='button'
          className='btn btn-sm btn-outline-success-pink'
          onClick={() => {
            if (!token || commentLoading) return;
            makeComment();
          }}
        >
          {!token && 'Sign in to comment'}
          {token && !commentLoading
            ? 'Comment'
            : token && (
                <>
                  Loading
                  <span
                    className='spinner-border spinner-border-sm text-pink-success ms-1'
                    role='status'
                  />
                </>
              )}
        </button>
        {comments &&
          comments.length > 0 &&
          comments.map((comment, i) => {
            return (
              <Comment
                key={`comment-${i}`}
                userName={comment.commenterName}
                walletAddress={comment.commentFrom}
                date={comment.postDate}
                comment={comment.comment}
              />
            );
          })}
      </div>
    </>
  );
};

export default Nft;
