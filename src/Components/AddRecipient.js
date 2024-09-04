import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import { useAddRecipient } from '../Hooks/useAddRecipient';
import { useTransaction } from '../Contexts/TransactionContext';

const AddRecipient = () => {
  const [showModal, setShowModal] = useState(false);
  const { isConnected, connectWallet, balance } = useWallet();
  const {
    satsFormat,
    handleFormatChange,
    address,
    amount,
    error,
    handleAddressChange,
    handleAmountChange,
    handleSubmit
  } = useAddRecipient();
  const { outputs, createEmptyOutput } = useTransaction();
  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const onSubmit = () => {
    if (handleSubmit()) {
      setShowModal(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => createEmptyOutput(true)} 
        title="+" 
        className='fixed rounded-full text-white bg-zinc-900 
        border-zinc-200 border-4 text-sm w-10 h-16 top-20 
        right-5 hover:bg-zinc-950 z-10 flex items-center justify-center'
        disabled={outputs.length > 0 && !outputs[outputs.length - 1].amount && !outputs[outputs.length - 1].address}
      />
    </>
  );
};

export default AddRecipient;