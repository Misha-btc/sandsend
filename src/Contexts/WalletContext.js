import React, { createContext, useState, useContext, useEffect } from 'react';
import useConnectWallet from '../Hooks/useConnectWallet';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { connectWallet } = useConnectWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
    if (storedAddresses.payment && storedAddresses.payment.address) {
      setIsConnected(true);
      setPaymentAddress(storedAddresses.payment.address);
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
    }
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      paymentAddress, 
      balance, 
      updateBalance,
      connectWallet: handleConnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);