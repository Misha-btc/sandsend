import React, { useState } from 'react';
import Modal from './Modal/Modal';
import Button from './Button';

const AddRecipient = () => {
  const [showUtxo, setShowUtxo] = useState(false);
  const [satsFormat, setFormat] = useState('btc');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  
  console.log(`adres`, address)
  function handleAddressChange(e) {
    const newValue = e.target.value;
    const regex = /^[A-Za-z0-9]{0,74}$/;

    if (regex.test(newValue)) {
      setAddress(newValue);
      setError('');
    } else {
      setError('wrong address');
    }
  }

  return (
    <div className=''>
      <Button 
        onClick={() => setShowUtxo(!showUtxo)} 
        title="+" 
        className='fixed rounded-full text-white bg-zinc-900 border-zinc-200 border-4 text-sm leading-none w-10 h-16 top-20 right-5 hover:text-white hover:bg-zinc-950 z-10 items-center justify-center'
      />
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)} className='right-10 top-24'>
        <div className="p-4 flex justify-center flex-col items-center">
            <div className="m-4 w-full">
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700">
                Recipient Address
              </label>
              <div className="flex">
                <input
                  onChange={handleAddressChange}
                  id="recipientAddress"
                  value={address}
                  type="text"
                  className="w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
            {error}
            <div className="m-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="flex">
                <input
                  id="amount"
                  type="number"
                  className="w-full border border-gray-300 rounded-l-md"
                />
                <select
                  value={satsFormat}
                  onChange={(e) => setFormat(e.target.value)}
                  className="border border-gray-300 rounded-r-md bg-white p-2"
                >
                  <option value="btc">btc</option>
                  <option value="sats">sats</option>
                </select>
              </div>
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default AddRecipient;