import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import { useAddRecipient } from '../Hooks/useAddRecipient';

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
        onClick={() => setShowModal(true)} 
        title="+" 
        className='fixed rounded-full text-white bg-zinc-900 
        border-zinc-200 border-4 text-sm w-10 h-16 top-20 
        right-5 hover:bg-zinc-950 z-10 flex items-center justify-center'
      />
      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)}
        className="fixed top-24 right-8 bg-white border-4 border-orange-600 rounded-xl"
      >
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">add recipient</h2>
            <h2 className="text-xs font-bold">{balance} sats</h2>
          </div>
          {!isConnected && (
            <Button
              onClick={handleConnectWallet}
              title="Подключить кошелек"
              className="mb-4 w-full bg-blue-500 text-white p-2 rounded"
            />
          )}
          <div className="mb-4">
            <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-1">
              address
            </label>
            <input
              onChange={handleAddressChange}
              id="recipientAddress"
              value={address}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              amount
            </label>
            <div className="flex">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="w-full border border-gray-300 rounded-l-md p-2"
              />
              <select
                value={satsFormat}
                onChange={handleFormatChange}
                className="border border-gray-300 rounded-r-md bg-white p-2"
              >
                <option value="btc">btc</option>
                <option value="sats">sats</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={onSubmit} 
            title="add" 
            className='w-full bg-black text-white rounded-md px-4 py-2 hover:bg-orange-600'
          />
        </div>
      </Modal>
    </>
  );
};

export default AddRecipient;