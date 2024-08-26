import React, { useState, useEffect } from 'react';
import Button from './Button';
import useConnectWallet from '../Hooks/useConnectWallet';
import useFetchUtxos from '../Hooks/useFetchUtxos';
import '../index.css'
import { key, sandshrewMainnet} from '../keystore';
import useGetBalance from '../Hooks/useGetBalance';

function Header() {
  const { connectWallet, isConnected, paymentAddress } = useConnectWallet();
  const { fetchUtxos } = useFetchUtxos(sandshrewMainnet+key);
  const [displayAddress, setDisplayAddress] = useState('');
  const { balance, fetchBalance } = useGetBalance();

  useEffect(() => {
    const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
    if (storedAddresses.payment && storedAddresses.payment.address) {
      const address = storedAddresses.payment.address;
      setDisplayAddress(`${address.slice(0, 3)}...${address.slice(-5)}`);
      fetchUtxos();
      fetchBalance();
    }
  }, [fetchUtxos, fetchBalance]);


  const handleConnectClick = async () => {
    await connectWallet();
    fetchUtxos();
    fetchBalance();
  };

  return (
    <header className="bg-black text-white font-bold p-3 fixed left-0 top-0 right-0 w-full z-30">
      <div className='flex justify-between items-center max-w-6xl mx-auto relative'>
        <div className='w-24 sm:w-32'></div>
        <div className='absolute left-1/2 transform -translate-x-1/2 italic text-2xl sm:text-3xl text-center'>
          sandsend<span className='text-orange-600 text-sm sm:text-lg align-top'>サンド</span>
        </div>
        {isConnected || displayAddress ? (
          <div className='w-24 sm:w-32 p-1 text-sm sm:text-base text-white text-center'>
            <div>{displayAddress || `${paymentAddress.slice(0, 3)}...${paymentAddress.slice(-5)}`}</div>
              <div className='text-xs'>{balance} sats</div>
          </div>
        ) : (
          <Button 
            onClick={handleConnectClick} 
            title='connect' 
            className='w-24 sm:w-32 p-1 text-sm sm:text-base text-white text-center rounded hover:bg-zinc-900 hover:text-glow'
          />
        )}
      </div>
    </header>
  );
}

export default Header;