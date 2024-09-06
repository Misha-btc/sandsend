import React, { createContext, useState, useContext, useEffect } from 'react';
import { key, sandshrewMainnet, sandshrewSignet, sandshrewTestnet } from '../keystore';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [network, setNetwork] = useState(() => {
    return localStorage.getItem('network') || 'mainnet';
  });

  const getUrlForNetwork = (net) => {
    switch (net) {
      case 'mainnet':
        return sandshrewMainnet + key;
      case 'testnet':
        return sandshrewTestnet + key;
      case 'signet':
        return sandshrewSignet + key;
      default:
        return sandshrewMainnet + key;
    }
  };

  const [url, setUrl] = useState(() => getUrlForNetwork(network));

  useEffect(() => {
    localStorage.setItem('network', network);
    setUrl(getUrlForNetwork(network));
  }, [network]);

  return (
    <NetworkContext.Provider value={{ network, setNetwork, url }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
