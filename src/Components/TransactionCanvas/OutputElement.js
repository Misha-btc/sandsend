import React, { useState } from 'react';
import Button from '../Button';
import { useTransaction } from '../../Contexts/TransactionContext';

const OutputElement = ({ output, index, removeOutput }) => {
  const [edit, setEdit] = useState(false);
  const [amount, setAmount] = useState(output.amount);
  const { updateSpecificOutput, change } = useTransaction();

  const handleEditUpdate = (e) => {
    setEdit(!edit);
  }

  const handleAddressUpdate = (e) => {
    const newAddress = e.target.value;
    updateSpecificOutput(index, { address: newAddress });
  };

  const handleAmountUpdate = (e) => {
    const newAmount = Number(e.target.value);
    updateSpecificOutput(index, { amount: newAmount });
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow-md mb-4 relative border-2 border-orange-600">
      <Button
        title="x"
        onClick={() => removeOutput(index)}
        className="absolute -top-3 -left-2 font-bold text-2xl text-white hover:text-gray-400"
      >
      </Button>
      {edit || amount === 0 ? (
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          title="confirm"
          onClick={() => {
            setEdit(false);
            setAmount(output.amount);
          }}
        />
      ) : (
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          title="edit"
          onClick={() => setEdit(true)}
        />
      )}
      {edit || amount === 0 ? (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
            address
          </label>
          <input
            id="address"
            type="text"
            value={output.address}
            onChange={handleAddressUpdate}
            className="w-full border border-gray-300 text-center rounded-md bg-zinc-900 text-white p-1 mb-2"
          />
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            amount
          </label>
          <input
            id="amount"
            type="number"
            value={output.amount}
            onChange={handleAmountUpdate}
            className="w-full border border-gray-300 text-center rounded-md bg-zinc-900 text-white p-1"
          />
          <div className="mt-2">
            <Button
              title="max"
              className="w-full hover:text-green-500 text-gray-500"
              onClick={() => {
                updateSpecificOutput(index, { amount: change+output.amount });
              }}
            />
          </div>
        </div>
      ) : (
        <div className="pt-3 pb-2">
          <p className="text-green-500 mb-2">address: {output.address.slice(0, 3)}...{output.address.slice(-5)}</p>
          <p className="text-white">
            amount: {output.amount} {output.satsFormat}
          </p>
        </div>
      )}
    </div>
  );
};

export default OutputElement;
