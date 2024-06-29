import React from 'react';
import bitcoinLogo from '../icons/bitcoin.svg.webp'; // Убедитесь, что путь к изображению правильный
import ordinalsLogo from '../icons/ordinals1.png'; // Убедитесь, что путь к изображению правильный

const AddressButton = ({ addressType, onClick }) => {
  const logo = addressType === 'ordinals' ? ordinalsLogo : bitcoinLogo;
  return (
    <button 
      key={addressType} 
      onClick={onClick} 
      style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
    >
      <img src={logo} alt={`${addressType} Logo`} style={{ width: '35px', height: '35px' }} />
    </button>
  );
}

export default AddressButton;