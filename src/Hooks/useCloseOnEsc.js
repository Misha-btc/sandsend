import { useEffect } from 'react';

const useCloseOnEsc = (onClose) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
};

export default useCloseOnEsc;