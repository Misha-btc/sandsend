import React, { useState } from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import { useWallet } from '../../Contexts/WalletContext'; 
import OutputElement from './OutputElement';

const Output = ({ output, index, removeOutput }) => {
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
    setChange,
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
    setErrors({ ...errors, amountError: '' });
    setInputError('');
    setAmount(newAmount);
    console.log(`newAmount: ${newAmount}`);
    // Обновляем временный вывод при изменении сумм
    setTemporaryOutput({ amount: newAmount, index: index, coinFormat: coinFormat });
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
        addressType: '',
      });
      if (coinFormat === 'btc') {
        updateSpecificOutput(index, { amount: amount === '' ? '' : Number(amount) * 100000000, address: address});
      } else {
        updateSpecificOutput(index, { amount: amount === '' ? '' : Number(amount), address: address, satsFormat: coinFormat});
      }
      if (address.startsWith('bc1p')) {
        updateSpecificOutput(index, { addressType: 'p2tr'});
      } else if (address.startsWith('3')) {
        updateSpecificOutput(index, { addressType: 'p2sh'});
      } else if (address.startsWith('bc1q')) {
        updateSpecificOutput(index, { addressType: 'p2wsh'});
      } else  if (address.startsWith('1')){
        updateSpecificOutput(index, { addressType: 'p2pkh'});
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
        maxAmount = Number(temporaryOutput.amount) > 0 ? Number(temporaryOutput.amount) + Number(change) : Number(change);
      }
      setAmount(maxAmount);
      // Обновляем временный вывод при установке максимальной суммы
      setTemporaryOutput({ amount: maxAmount, index, coinFormat });
    }
  };

  const handleEdit = () => {
    setEdit(true);
    setTemporaryOutput({
      address: output.address,
      amount: output.amount,
      satsFormat: output.satsFormat,
      index: output.index,
      addressType: output.addressType,
    });
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
    <div className="bg-gradient-to-r from-zinc-800 to-zinc-950 p-4 rounded-lg shadow-md mb-4 relative border-2 border-orange-600 w-60">
        <OutputElement
          output={output}
          index={index}
          indexEdit={indexEdit}
          handleRemoveOutput={handleRemoveOutput}
          address={address}
          amount={amount}
          errors={errors}
          handleFormatChange={handleFormatChange}
          handleAddressUpdate={handleAddressUpdate}
          handleAmountUpdate={handleAmountUpdate}
          handleMaxAmount={handleMaxAmount}
          handleConfirm={handleConfirm}
          handleEdit={handleEdit}
        />
    </div>
  );
};

export default Output;
