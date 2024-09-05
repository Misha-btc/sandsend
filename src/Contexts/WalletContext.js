import React, { createContext, useState, useContext, useEffect } from 'react';
import useConnectWallet from '../Hooks/useConnectWallet';
import useDisconnectWallet from '../Hooks/useDisconnect';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { connectWallet } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [paymentAddressType, setPaymentAddressType] = useState('');
  const [ordinalsAddressType, setOrdinalsAddressType] = useState('');
  const [ordinalsAddress, setOrdinalsAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [ordinalsPublicKey, setOrdinalsPublicKey] = useState('');
  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
    if (storedAddresses.payment && storedAddresses.payment.address && storedAddresses.ordinals && storedAddresses.ordinals.address) {
      setIsConnected(true);
      setPaymentAddress(storedAddresses.payment.address);
      setOrdinalsAddress(storedAddresses.ordinals.address);
      setPaymentAddressType(storedAddresses.payment.addressType);
      setOrdinalsAddressType(storedAddresses.ordinals.addressType);
      setPublicKey(storedAddresses.payment.publicKey);
      setOrdinalsPublicKey(storedAddresses.ordinals.publicKey);
    }
  }, []);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (result.success) {
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
      setIsConnected(false);
      setPaymentAddress('');
      setOrdinalsAddress('');
      setPaymentAddressType('');
      setOrdinalsAddressType('');
      setPublicKey('');
      setOrdinalsPublicKey('');
      setBalance(0);
      localStorage.clear();
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