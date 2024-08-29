import React, { useEffect } from 'react';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import useFetchUtxos from '../Hooks/useFetchUtxos';
import useGetBalance from '../Hooks/useGetBalance';
import { key, sandshrewMainnet } from '../keystore';

function Header() {
  const { connectWallet, isConnected, paymentAddress, balance, updateBalance } = useWallet();
  const { fetchUtxos } = useFetchUtxos(sandshrewMainnet + key);
  const { fetchBalance } = useGetBalance();

  useEffect(() => {
    if (isConnected && paymentAddress) {
      fetchUtxos();
      fetchBalance().then(newBalance => updateBalance(newBalance));
    }
  }, [isConnected, paymentAddress, fetchUtxos, fetchBalance, updateBalance]);

  const handleConnectClick = async () => {
    await connectWallet();
  };

  const displayAddress = paymentAddress ? `${paymentAddress.slice(0, 3)}...${paymentAddress.slice(-5)}` : '';

  return (
    <header className="bg-black text-white font-bold p-3 fixed left-0 top-0 right-0 w-full z-30">
      <div className='flex justify-between items-center max-w-6xl mx-auto relative'>
        <div className='w-24 sm:w-32'></div>
        <div className='absolute left-1/2 transform -translate-x-1/2 italic text-2xl sm:text-3xl text-center'>
          sandsend<span className='text-orange-600 text-sm sm:text-lg align-top'>fees</span>
        </div>
        {isConnected ? (
          <div className='w-24 sm:w-32 p-1 text-sm sm:text-base text-white text-center'>
            <div>{displayAddress}</div>
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