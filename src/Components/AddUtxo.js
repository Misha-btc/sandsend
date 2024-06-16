import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import YourUtxo from './YourUtxo';

const AddUtxo = () => {
  const [showUtxo, setShowUtxo] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowUtxo(!showUtxo)} title="+ add UTXO" className='fixed text-white bg-black p-2 top-20 left-1/2 bg-black hover:bg-zinc-900 z-10 transform -translate-x-1/2'/>
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <YourUtxo />
      </Modal>
    </div>
  );
};

export default AddUtxo;