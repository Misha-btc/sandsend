import React from 'react';
import bitcoinLogo from '../icons/bitcoin-logo.webp'; // Убедитесь, что путь к изображению правильный

const AddressButton = ({ keyProp = 'ordinals', onClick }) => {
  return (
    <button 
      key={keyProp} 
      onClick={onClick} 
      style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
    >
      <img src={bitcoinLogo} alt="Bitcoin Logo" style={{ width: '35px', height: '35px' }} />
    </button>
  );
}

export default AddressButton;