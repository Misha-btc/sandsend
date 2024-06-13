import React from 'react';
import { useTransition, animated } from '@react-spring/web';

const Modal = ({ show, onClose, children }) => {
  const transition = useTransition(show, {
    from: {
      scale: 0.98,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
    },
    leave: {
      scale: 0.9,
      opacity: 0,
    },
    config: (item, state) => {
      switch (state) {
        case 'leave':
          return { duration: 0 };
        default:
          return { duration: 100 };
      }
    },
  });

  const maskTransition = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 0.5 },
    leave: { opacity: 0 },
    config: { duration: 100 },
  });

  return (
    <>
      {maskTransition((style, item) =>
        item && (
          <animated.div
            style={style}
            className='bg-zinc-700 fixed inset-0 flex justify-center items-top z-10 backdrop-blur-xl'
            onClick={onClose}
          />
        )
      )}
      {transition((style, item) =>
        item && (
          <animated.div
            style={style}
            className='border-0.1 border-zinc-200 rounded-xl fixed inset-3px justify-center items-top bg-white z-10 shadow-3xl max-h-3/4 overflow-auto'
          >
            {children}
          </animated.div>
        )
      )}
    </>
  );
};

export default Modal;