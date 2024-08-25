import React from 'react';

const AddressButton = ({ addressType, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
    >
      {addressType}
    </button>
  );
}

export default AddressButton;