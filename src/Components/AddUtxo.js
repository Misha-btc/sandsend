import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import YourUtxo from './YourUtxo';

const AddUtxo = () => {
  const [showUtxo, setShowUtxo] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowUtxo(!showUtxo)} title="+"  className='fixed rounded-full text-black bg-zinc-200 border-white border-4 text-xl w-14 h-14 top-20 left-5 hover:text-white hover:bg-transparent z-10'/>
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <YourUtxo />
      </Modal>
    </div>
  );
};

export default AddUtxo;