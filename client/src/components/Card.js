import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import TokenIcon from './TokenIcon';
import { createAvatar } from '@dicebear/avatars';
import { timeDifference } from '../helpers/utilities';
import * as style from '@dicebear/avatars-identicon-sprites';
import { eth_usd as returnEthUsd } from '../helpers/utilities';

export const Card = ({
  _id,
  title,
  author,
  avatar,
  desc,
  cost,
  dateCreated,
  imgSrc,
  type,
}) => {
  const [ethUsd, setEthUsd] = useState();
  const [isIOS, setIsIOS] = useState(false);

  let svg = createAvatar(style, {
    seed: avatar,
    dataUri: true,
    width: 35,
  });

  useEffect(() => {
    async function fetchEthUsd() {
      const ethUsd = await returnEthUsd();
      setEthUsd(ethUsd.data?.data.rates.USD);
    }
    fetchEthUsd();

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
  }, []);

  return (
    <div className='col-12 col-md-6 col-lg-4'>
      <div className='card' to='/nft'>
        {type !== 'video/webm' && (
          <NavLink to={`/nft?id=${_id}`}>
            <div
              className='card__img'
              style={{
                backgroundImage: `url(${imgSrc})`,
              }}
            />
          </NavLink>
        )}
        {type === 'video/webm' && !isIOS && (
          <div className='card__img d-flex align-items-center justify-content-center'>
            <video
              className='web-m-video'
              style={{ borderRadius: 15 }}
              controls={true}
              playsInline={true}
            >
              <source src={imgSrc} type='video/webm' />
              <p>
                Your browser doesn't support HTML video. Here is a
                <a href={imgSrc}>link to the video</a> instead.
              </p>
            </video>
          </div>
        )}
        {type === 'video/webm' && isIOS && (
          <div className='card__img d-flex align-items-center justify-content-center'>
            <p style={{ padding: '0 2rem' }}>
              Sorry, we dont support WEBM on iOS. Browse MONKE on a desktop or
              android device. <a href={imgSrc}>Heres a link to the video</a>.
            </p>
          </div>
        )}
        <div className='card__body'>
          {/* header */}
          <NavLink className='text-decoration-none' to={`/nft?id=${_id}`}>
            <div className='card__body-header'>
              <div className='card__body-header-info'>
                <p>{title}</p>
                <small>@{author !== undefined ? author : 'anonymous'}</small>
              </div>
              <div className='card__body-header-avatar'>
                <div className='rounded bg-secondary bg-gradient p-1 shadow'>
                  <img alt='avatar' src={svg} />
                </div>
              </div>
            </div>
          </NavLink>
          {/* lower */}
          <div className='card__body-lower'>
            <p>{desc}</p>
            <div className='card__body-lower-stake'>
              <TokenIcon ticker='eth' height={30} styles />
              <div className='card__body-lower-stake-container'>
                <p>{cost} ETH</p>
                <small>
                  {ethUsd && cost
                    ? '$' + Number(ethUsd * cost).toLocaleString()
                    : '...'}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className='card__footer'>
          <div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              fill='rgb(108, 117, 125)'
              className='bi bi-clock'
              viewBox='0 0 16 16'
            >
              <path d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z' />
              <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z' />
            </svg>
            <small className='ms-1 d-inline-block'>
              {timeDifference(dateCreated)}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardLoading = () => {
  return (
    <div className='col-12 col-md-6 col-lg-4'>
      <div className='card'>
        <div className='card__img-loading' />
        <div className='card__body'>
          {/* header */}
          <div className='card__body-header'>
            <div className='card__body-header-info w-100'>
              <div className='card-loading-l' />
            </div>
            <div className='card__body-header-avatar'>
              <div className='rounded p-1 shadow avatar-loading' />
            </div>
          </div>
          {/* lower */}
          <div className='card__body-lower'>
            <div className='card__body-lower-stake'>
              <div className='card__body-lower-stake-container w-100'>
                <div className='card-loading-s' />
                <div className='card-loading-m mt-4' />
                <div className='card-loading-s' style={{ marginTop: 12 }} />
              </div>
            </div>
          </div>
        </div>
        <div className='card__footer'>
          <div className='card-loading-s w-100' />
        </div>
      </div>
    </div>
  );
};
