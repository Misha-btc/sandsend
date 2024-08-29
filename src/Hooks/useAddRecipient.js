import { useState } from 'react';
import { useWallet } from '../Contexts/WalletContext';
import { useTransaction } from '../Contexts/TransactionContext';

export function useAddRecipient() {
  const [satsFormat, setFormat] = useState('sats');
  const txFormat = 'sats';
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txAmount, setTxAmount] = useState(0);
  const [error, setError] = useState('');
  const { balance } = useWallet();
  const { updateOutput } = useTransaction();
  const regex = /^[A-Za-z0-9]{0,74}$/;

  function handleAddressChange(e) {
    const newValue = e.target.value;
    if (regex.test(newValue)) {
      setAddress(newValue);
      setError('');
    } else {
      setError('address is invalid');
    }
  }

  function handleAmountChange(e) {
    if (satsFormat === 'sats') {
      if (balance < e.target.value) {
        setError('you are too poor');
        return;
      }
      setTxAmount(Number(e.target.value));
      setError('');
    } else {
      const amount = e.target.value * 100000000;
      if (amount > balance) {
        setError('you are too poor');
        return;
      }
      setTxAmount(Number(amount));
      setError('');
    }
    setAmount(e.target.value);
  }

  function handleSubmit() {
    if (!address || !amount) {
      setError('Please fill in all fields');
      return false;
    }
    if (!regex.test(address)) {
      return { success: false, error: 'Invalid address format' };
    }
    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return { success: false, error: 'Invalid amount' };
    }
    if (satsFormat === 'sats') {
        if (balance < amountNumber) {
          return { success: false, error: 'Недостаточно средств' };
        }
      } else {
        const satsAmount = amountNumber * 100000000;
        if (balance < satsAmount) {
          return { success: false, error: 'Недостаточно средств' };
        }
        }

    if (address.length < 74) {
    updateOutput({'address':address, 'amount':txAmount, 'satsFormat': txFormat, 'status': 'pending'});
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
    handleSubmit
  };
}
