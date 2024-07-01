import React, { useState } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';

const OutputElement = ({ range }) => {
  const [showUtxo, setShowUtxo] = useState(false);

  const getTitle = () => {
    if (range) {
      return `${range.address.slice(0, 3)}...${range.address.slice(-7)}`;
    }
    return 'No range';
  };

  return (
    <>
      <Button
        onClick={() => setShowUtxo(!showUtxo)}
        className='rounded-xl hover:bg-orange-700 bg-orange-600 text-white p-3 w-32 h-12 shadow-md'
        title={getTitle()}
      />
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <ModalHeader title='OUTPUT' />
        <div>
          <p>Min: {range.min}</p>
          <p>Max: {range.max}</p>
          <p>Sats: {range.sats}</p>
          <p>Address: {range.address}</p>
        </div>
      </Modal>
    </>
  );
};

export default OutputElement;