import { useState, useEffect } from 'react';
import { key, sandshrewMainnet, sandshrewSignet } from '../keystore';

const useNetwork = () => {
  const [network, setNetwork] = useState(() => {
    return localStorage.getItem('network') || 'mainnet';
  });

  const getUrlForNetwork = (net) => {
    switch (net) {
      case 'mainnet':
        return sandshrewMainnet + key;
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

  return { network, setNetwork, url };
};

export default useNetwork;
