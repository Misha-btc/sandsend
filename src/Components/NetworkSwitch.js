import React from 'react';
import { useNetwork } from '../Contexts/NetworkContext';

const NetworkSwitch = () => {
  const { network, setNetwork } = useNetwork();

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
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