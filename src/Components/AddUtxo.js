import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import YourUtxo from './YourUtxo';

const AddUtxo = () => {
  const [showUtxo, setShowUtxo] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowUtxo(!showUtxo)} 
        title="UTXOs" 
        className='fixed rounded-full text-white bg-zinc-900 border-zinc-200 border-4 text-sm w-16 h-16 top-20 left-5 hover:text-white hover:bg-zinc-950 z-10 flex items-center justify-center'
      />
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <YourUtxo />
      </Modal>
    </>
  );
};

export default AddUtxo;