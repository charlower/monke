import { useState, useRef, useEffect } from 'react';

const LightBox = ({ children, src, alt, Wrapper = 'div', zIndex = 100 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggleIsOpen = () => {
    if (isOpen) {
      const node = ref.current;
      node?.classList.remove('light-box_open');
      document.body.style.overflowY = 'scroll';
      setTimeout(() => setIsOpen(!isOpen), 300);
    } else {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const node = ref.current;

    if (isOpen) {
      node?.classList.add('light-box_open');
      document.body.style.overflowY = 'hidden';
    }
  });

  return (
    <Wrapper onClick={toggleIsOpen}>
      {children}
      {isOpen ? (
        <div
          ref={ref}
          onClick={toggleIsOpen}
          className='light-box'
          style={{
            zIndex,
          }}
        >
          <img src={src} alt={alt} />
        </div>
      ) : null}
    </Wrapper>
  );
};

export default LightBox;
