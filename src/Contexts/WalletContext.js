import React, { createContext, useState, useContext, useEffect } from 'react';
import useConnectWallet from '../Hooks/useConnectWallet';
import useDisconnectWallet from '../Hooks/useDisconnect';
import useGetBalance from '../Hooks/useGetBalance';
import { MAINNET_PREFIX_LIST, SIGNET_PREFIX_LIST } from '../addrPrefix';
import { useNetwork } from './NetworkContext';
const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { connectWallet } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const { fetchBalance } = useGetBalance();
  const [isConnected, setIsConnected] = useState(JSON.parse(localStorage.getItem('isConnected')) || false);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentAddressType, setPaymentAddressType] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const [ordinalsAddressType, setOrdinalsAddressType] = useState('');
  const [ordinalsAddress, setOrdinalsAddress] = useState('');
  const [ordinalsPublicKey, setOrdinalsPublicKey] = useState('');
  const [error, setError] = useState('');
  const { network } = useNetwork();

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
    if (storedAddresses.paymentAddress && storedAddresses.ordinalsAddress && !error) {
      setIsConnected(true);
      setPaymentAddress(storedAddresses.paymentAddress);
      setOrdinalsAddress(storedAddresses.ordinalsAddress);
      setPaymentAddressType(storedAddresses.paymentAddressType);
      setOrdinalsAddressType(storedAddresses.ordinalsAddressType);
      setPublicKey(storedAddresses.paymentPublicKey);
      setOrdinalsPublicKey(storedAddresses.ordinalsPublicKey);
    }
  }, [error, isConnected, paymentAddress]);

  useEffect(() => {
    const updateBalance = async () => {
      if (isConnected && paymentAddress) {
        if (network === 'mainnet' && MAINNET_PREFIX_LIST.some(prefix => paymentAddress.startsWith(prefix))) {
          // Логика для mainnet
          const newBalance = await fetchBalance(paymentAddress);
          setBalance(newBalance);
          setIsConnected(true);
          setError('');
        } else if (network === 'signet' && SIGNET_PREFIX_LIST.some(prefix => paymentAddress.startsWith(prefix))) {
          // Логика для signet
          const newBalance = await fetchBalance(paymentAddress);
          setBalance(newBalance);
          setIsConnected(true);
          setError('');
        } else {
          localStorage.clear();
          setIsConnected(false);
          setError('invalid network');
          setBalance(null);
        }
      }
    };
    updateBalance();
  }, [isConnected, paymentAddress, fetchBalance, network]);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const handleConnectWallet = async () => {
    try {
      const result = await connectWallet();
      if (result.success) {
        localStorage.clear();
        localStorage.setItem('walletAddresses', JSON.stringify(result));
        setIsConnected(true);
        localStorage.setItem('isConnected', JSON.stringify(true));
        setPaymentAddress(result.paymentAddress);
        setOrdinalsAddress(result.ordinalsAddress);
        setPaymentAddressType(result.paymentAddressType);
        setOrdinalsAddressType(result.ordinalsAddressType);
        setPublicKey(result.paymentPublicKey);
        setOrdinalsPublicKey(result.ordinalsPublicKey);
        setError('');
      } else {
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.error || 'Failed to connect wallet');
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
      setBalance(null);
    }
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      paymentAddress,
      ordinalsAddress,
      ordinalsPublicKey,
      balance, 
      error,
      paymentAddressType,
      ordinalsAddressType,
      publicKey,
      setError,
      updateBalance,
      connectWallet: handleConnectWallet,
      disconnectWallet: handleDisconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);