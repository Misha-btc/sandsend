import React, { useState } from 'react';
import Button from '../Button';
import { useTransaction } from '../../Contexts/TransactionContext';
import { useWallet } from '../../Contexts/WalletContext'; 

const OutputElement = ({ output, index, removeOutput }) => {
  const { balance } = useWallet();
  const [coinFormat, setCoinFormat] = useState('sats');
  const [errors, setErrors] = useState({
    addressError: '',
    amountError: ''
  });
  const [indexEdit, setIndexEdit] = useState(false);
  const [amount, setAmount] = useState(output.amount);
  const [address, setAddress] = useState(output.address);
  const { 
    updateSpecificOutput, 
    change, 
    temporaryOutput, 
    setTemporaryOutput, 
    setEdit, 
    outputs, 
    inputError, 
    setInputError 
  } = useTransaction();

  const handleFormatChange = (e) => {
    const newFormat = e.target.value;
    setCoinFormat(newFormat);
    // Обновляем временный вывод при изменении формата
    setTemporaryOutput({ amount, index, coinFormat: newFormat });
  }

  const handleAddressUpdate = (e) => {
    const newAddress = e.target.value;
    setErrors({ ...errors, addressError: '' });
    setAddress(newAddress);
  };

  const validateAddress = (address) => {
    const regex = /^(bc1|tb1|[123])[a-zA-HJ-NP-Z0-9]{25,87}$/;
    if (regex.test(address)){
      return '';
    } else {
      return 'invalid address';
    }
  };

  const validateAmount = (amount) => {
    if (amount === '' || amount === null || Number(amount) === 0) {
      return 'amount is required';
    } else if ((coinFormat === 'sats' && Number(amount) > balance) || 
    (coinFormat === 'btc' && Number(amount) > balance / 100000000)) {
      return 'amount is greater than balance';
    } else if (inputError) {
      return inputError;
    } else {
      return '';
    }
  };

  const handleAmountUpdate = (e) => {
    const newAmount = e.target.value;
    if (newAmount.startsWith('-')) {
      return;
    }
    const [integerPart, decimalPart] = newAmount.split('.');
    const formattedAmount = decimalPart ? `${integerPart}.${decimalPart.slice(0, 8)}` : newAmount;
    setErrors({ ...errors, amountError: '' });
    setInputError('');
    setAmount(formattedAmount);
    // Обновляем временный вывод при изменении суммы
    setTemporaryOutput({ amount: formattedAmount, index, coinFormat });
  };

  // Удаляем useEffect, так как теперь обновление происходит в обрботчиках

  const handleConfirm = () => {
    const amountError = validateAmount(amount);
    const addressError = validateAddress(address);
    if (amountError) {
      setErrors({ ...errors, amountError: amountError });
      return;
    } else if (addressError) {
      setErrors({ ...errors, addressError: addressError });
      return;
    } else {
      setTemporaryOutput({
        address: '',
        amount: '',
        satsFormat: '',
        index: '',
      });
      if (coinFormat === 'btc') {
        updateSpecificOutput(index, { amount: amount === '' ? '' : Number(amount) * 100000000, address: address});
      } else {
        updateSpecificOutput(index, { amount: amount === '' ? '' : Number(amount), address: address, satsFormat: coinFormat});
      }
      setAmount('');
      setAddress('');
      setIndexEdit(false);
      setEdit(false);
    }
  }

  const handleMaxAmount = () => {
    if (change > 0) {
      let maxAmount;
      if (coinFormat === 'btc') {
        maxAmount = (
          (Number(change) / 100000000) + 
          (Number(temporaryOutput.amount) || Number(output.amount) || 0)
        );
      } else if (coinFormat === 'sats') {
        maxAmount = Number(change) + (Number(temporaryOutput.amount) || Number(output.amount) || 0);
      }
      setAmount(maxAmount);
      // Обновляем временный вывод при установке максимальной суммы
      setTemporaryOutput({ amount: maxAmount, index, coinFormat });
    }
  };

  const handleEdit = () => {
    setEdit(true);
    setIndexEdit(true);
    setAddress(output.address);
    setAmount(output.amount);
  }

  const handleRemoveOutput = () => {
    if (index > 0) {
      removeOutput(index);
    } else if (index === 0 && outputs.length === 1) {
      updateSpecificOutput(index, { amount: '', address: ''});
    } else if (index === 0 && outputs.length > 1) {
      removeOutput(index);
    }
    setAmount('');
    setAddress('');
    setTemporaryOutput({
      address: '',
      amount: '',
      satsFormat: '',
      index: '',
    });
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow-md mb-4 relative border-2 border-orange-600">
      <Button
        title="x"
        onClick={handleRemoveOutput}
        className="absolute -top-3 -left-2 font-bold text-2xl text-white hover:text-gray-400"
      >
      </Button>
      {(indexEdit || output.amount === '' || output.amount === 0 || output.amount === null) ? (
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          title="confirm"
          onClick={handleConfirm}
        />
      ) : (
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-white"
          title="edit"
          onClick={handleEdit}
        />
      )}
      {(indexEdit || output.amount === '' || output.amount === 0 || output.amount === null)  ? (
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
            address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={handleAddressUpdate}
            className="w-full text-center rounded-md bg-zinc-900 text-white p-1 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.addressError && (
            <div className="text-red-500 text-xs mt-1">{errors.addressError}</div>
          )}
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            amount
          </label>
          <div className="flex items-center">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountUpdate}
              className="w-3/4 text-center rounded-md bg-zinc-900 text-white p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              className="rounded-md bg-zinc-600 text-white p-1 hover:bg-zinc-700 ml-2 shadow-md focus:outline-none"
              value={coinFormat}
              onChange={(e) => {
                handleFormatChange(e);
              }}
            >
              <option value="sats">sats</option>
            </select>
          </div>
          {errors.amountError && (
            <div className="text-red-500 text-xs mt-1">{errors.amountError}</div>
          )}
          <div className="mt-2">
            <Button
              title="max"
              className="w-full hover:text-green-500 text-gray-500"
              onClick={handleMaxAmount}
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
