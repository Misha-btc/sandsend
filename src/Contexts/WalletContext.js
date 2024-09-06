import React, { createContext, useState, useContext, useEffect } from 'react';
import useConnectWallet from '../Hooks/useConnectWallet';
import useDisconnectWallet from '../Hooks/useDisconnect';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { connectWallet } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();


  const [isConnected, setIsConnected] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentAddressType, setPaymentAddressType] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const [ordinalsAddressType, setOrdinalsAddressType] = useState('');
  const [ordinalsAddress, setOrdinalsAddress] = useState('');
  const [ordinalsPublicKey, setOrdinalsPublicKey] = useState('');

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
    console.log('storedAddresses', storedAddresses);
    if (storedAddresses.paymentAddress && storedAddresses.ordinalsAddress) {
      setIsConnected(true);
      setPaymentAddress(storedAddresses.paymentAddress);
      setOrdinalsAddress(storedAddresses.ordinalsAddress);
      setPaymentAddressType(storedAddresses.paymentAddressType);
      setOrdinalsAddressType(storedAddresses.ordinalsAddressType);
      setPublicKey(storedAddresses.paymentPublicKey);
      setOrdinalsPublicKey(storedAddresses.ordinalsPublicKey);
    }
  }, []);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (result.success) {
      localStorage.setItem('walletAddresses', JSON.stringify(result));
      setIsConnected(true);
      setPaymentAddress(result.paymentAddress);
      setOrdinalsAddress(result.ordinalsAddress);
      setPaymentAddressType(result.paymentAddressType);
      setOrdinalsAddressType(result.ordinalsAddressType);
      setPublicKey(result.paymentPublicKey);
      setOrdinalsPublicKey(result.ordinalsPublicKey);
    }
  };

  const handleDisconnectWallet = async () => {
    const result = await disconnectWallet();
    if (result.success) {
      localStorage.clear();
      setIsConnected(false);
      setPaymentAddress('');
      setOrdinalsAddress('');
      setPaymentAddressType('');
      setOrdinalsAddressType('');
      setPublicKey('');
      setOrdinalsPublicKey('');
      setBalance(0);
    }
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      paymentAddress,
      ordinalsAddress,
      ordinalsPublicKey,
      balance, 
      paymentAddressType,
      ordinalsAddressType,
      publicKey,
      updateBalance,
      connectWallet: handleConnectWallet,
      disconnectWallet: handleDisconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);