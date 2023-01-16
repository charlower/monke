import monkeToken from '../img/monke-token-2.svg';
import ethToken from '../img/eth-token.svg';
const TokenIcon = ({ ticker, height, classes }) => {
  const returnImage = () => {
    switch (ticker) {
      case 'monke':
        return monkeToken;
      case 'eth':
        return ethToken;
      default:
        return monkeToken;
    }
  };
  return (
    <img
      alt='Logo'
      style={{
        height: height,
        borderRadius: '100%',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.33)',
      }}
      className={classes ? classes : ''}
      src={returnImage()}
    />
  );
};

export default TokenIcon;
