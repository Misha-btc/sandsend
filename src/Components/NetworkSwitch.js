import React, { useState } from 'react';
import { key, sandshrewMainnet, sandshrewSignet, sandshrewTestnet } from '../keystore';

const NetworkSwitch = () => {
  const [network, setNetwork] = useState('mainnet');

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
    // Здесь можно добавить логику для переключения сети
    console.log(`Сеть изменена на: ${event.target.value}`);
  };

  return (
    <div className="network-switch">
      <select id="network" value={network} onChange={handleNetworkChange} className="bg-zinc-800 focus:outline-none text-white p-2 rounded">
        <option value="mainnet">mainnet</option>
        <option value="testnet">testnet</option>
        <option value="signet">signet</option>
      </select>
    </div>
  );
};

export default NetworkSwitch;
