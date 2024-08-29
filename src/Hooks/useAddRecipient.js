import { useState } from 'react';
import { useWallet } from '../Contexts/WalletContext';
import { useTransaction } from '../Contexts/TransactionContext';

export function useAddRecipient() {
  const [satsFormat, setFormat] = useState('sats');
  const txFormat = 'sats';
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { balance } = useWallet();
  const { updateOutput } = useTransaction();
  const [addressError, setAddressError] = useState('');
  const [amountError, setAmountError] = useState('');

  function handleAddressChange(e) {
    setError('');
    const newValue = e.target.value;
    const regex = /^[A-Za-z0-9]{0,74}$/;
    setAddress(newValue);
    
    if (regex.test(newValue)) {
      setAddressError('');
    } else {
      setAddressError('address is invalid');
    }
  }

  function handleFormatChange(e) {
    if (e.target.value === 'sats') {
      if (balance < amount) {
        setAmountError('you are too poor');
      } else {
        setAmountError('');
      }
    } else {
      const satsAmount = amount * 100000000;
      if (balance < satsAmount) {
        setAmountError('you are too poor');
      } else {
        setAmountError('');
      }
    }
    setFormat(e.target.value);
    setError('');
  }

  function handleAmountChange(e) {
    setAmount(e.target.value);
    setError('');
    
    if (satsFormat === 'sats') {
      if (balance < e.target.value) {
        setAmountError('you are too poor');
      } else {
        setAmount(Number(e.target.value));
        setAmountError('');
      }
      //setTxAmount(Number(e.target.value));
    } else {
      const amount = e.target.value * 100000000;
      if (amount > balance) {
        setAmountError('you are too poor');
      } else {
        setAmount(Number(e.target.value));
        setAmountError('');
      }
    }
  }

  function handleSubmit() {
    if (addressError) {
      setError(addressError);
      return false;
    } else if (amountError) {
      setError(amountError);
      return false;
    }
    if (address && amount) {

      updateOutput({'address':address, 'amount':amount, 'satsFormat': txFormat, 'status': 'pending'});
      setAddress('');
      setAmount('');
      setFormat('sats');
      setError('');
      return true;
    } else {
      setError('Please fill in all fields');
      return false;
    }
  }

  return {
    satsFormat,
    setFormat,
    address,
    amount,
    error,
    handleAddressChange,
    handleAmountChange,
    handleFormatChange,
    handleSubmit
  };
}
