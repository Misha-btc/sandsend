import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import YourUtxo from './YourUtxo';

const AddUtxo = () => {
  const [showUtxo, setShowUtxo] = useState(false);

  return (
    <nav className='fixed top-16 left-4 bg-black hover:bg-zinc-900 z-10'>
      <Button onClick={() => setShowUtxo(!showUtxo)} title="+ add UTXO" />
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <YourUtxo />
      </Modal>
    </nav>
  );
};

export default AddUtxo;