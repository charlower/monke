import axios from 'axios';

export const ReturnIcon = ({ iconName, margin }) => {
  const returnPaths = () => {
    switch (iconName) {
      case 'bi-person-circle':
        return (
          <>
            <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
            <path
              fillRule='evenodd'
              d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
            />
          </>
        );
      case 'bi-box-arrow-right':
        return (
          <>
            <path
              fillRule='evenodd'
              d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z'
            />
            <path
              fillRule='evenodd'
              d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z'
            />
          </>
        );
      case 'bi-key':
        return (
          <>
            <path d='M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z' />
            <path d='M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
          </>
        );
      case 'bi-columns-gap':
        return (
          <path d='M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z' />
        );
      default:
        return 'no icon';
    }
  };

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='currentColor'
      className={`bi ${iconName} me-${margin}`}
      viewBox='0 0 16 16'
    >
      {returnPaths()}
    </svg>
  );
};

export const timeDifference = (date) => {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;
  let current = new Date();

  let elapsed = current - date;

  if (elapsed < msPerMinute) {
    const number = Math.round(elapsed / 1000);
    return number + `  second${number > 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerHour) {
    const number = Math.round(elapsed / msPerMinute);
    return number + ` minute${number > 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerDay) {
    const number = Math.round(elapsed / msPerHour);
    return number + ` hour${number > 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerMonth) {
    const number = Math.round(elapsed / msPerDay);
    return 'About ' + number + ` day${number > 1 ? 's' : ''} ago`;
  } else if (elapsed < msPerYear) {
    const number = Math.round(elapsed / msPerMonth);
    return 'About ' + number + ` month${number > 1 ? 's' : ''} ago`;
  } else {
    const number = Math.round(elapsed / msPerYear);
    return 'About ' + number + ` year${number > 1 ? 's' : ''} ago`;
  }
};

export const eth_usd = async () =>
  await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH');
