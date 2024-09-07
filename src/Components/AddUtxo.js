import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import YourUtxo from './YourUtxo';
import { useWallet } from '../Contexts/WalletContext';

const AddUtxo = () => {
  const [showUtxo, setShowUtxo] = useState(false);
  const { isConnected } = useWallet();

  if (!isConnected) {
    return null; // Ничего не рендерим, если кошелек не подключен
  }
  return (
    <>
      <Button 
        onClick={() => setShowUtxo(!showUtxo)} 
        title="UTXOs" 
        className='fixed rounded-full text-white bg-zinc-900 border-zinc-200 border-4 text-sm leading-none w-16 h-16 top-20 left-5 hover:text-white hover:bg-zinc-950 z-10 items-center justify-center'
      />
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)} className='inset-3px rounded-xl max-h-3/4'>
        <YourUtxo />
      </Modal>
    </>
  );
};

export default AddUtxo;