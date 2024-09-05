import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import { useAddRecipient } from '../Hooks/useAddRecipient';
import { useTransaction } from '../Contexts/TransactionContext';

const AddRecipient = () => {
  const [showModal, setShowModal] = useState(false);
  const { isConnected, connectWallet, balance } = useWallet();
  const { outputs, createEmptyOutput, edit, setEdit } = useTransaction();
  console.log(`edit: ${edit}`);

  const handleAddRecipient = () => {
    if (edit) {
      return;
    } else if (outputs.length > 0 && !outputs[outputs.length - 1].amount && !outputs[outputs.length - 1].address) {
      return;
    } else {
      createEmptyOutput(true);
    }
  };

  return (
    <>
      <Button 
        onClick={handleAddRecipient} 
        title="+" 
        className='fixed rounded-full text-white bg-zinc-900 
        border-zinc-200 border-4 text-sm w-10 h-16 top-20 
        right-5 hover:bg-zinc-950 z-10 flex items-center justify-center'
      />
    </>
  );
};

export default AddRecipient;