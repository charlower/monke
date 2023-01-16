import Logo1 from '../img/monke-logo-1.svg';
import Logo2 from '../img/monke-logo-2.svg';
import Logo3 from '../img/monke-logo-3.svg';
import Logo4 from '../img/monke-logo-4.svg';

const logoArray = [Logo1, Logo2, Logo3, Logo4];

export const LoaderLogo = ({ classes }) => {
  let randomLogo = logoArray[Math.floor(Math.random() * logoArray.length)];

  return (
    <img
      alt='Loader'
      className={`lazy-loader hue-animate ${classes && classes}`}
      src={randomLogo}
    />
  );
};
