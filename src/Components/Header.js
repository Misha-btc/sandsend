import React, { useEffect } from 'react';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import useFetchUtxos from '../Hooks/useFetchUtxos';
import useGetBalance from '../Hooks/useGetBalance';
import sandsend from '../icons/sandsend.jpeg';
import NetworkSwitch from './NetworkSwitch';


function Header() {
  const { connectWallet, disconnectWallet, isConnected, paymentAddress, balance, updateBalance } = useWallet();
  const { fetchUtxos } = useFetchUtxos();
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

  const handleDisconnectClick = async () => {
    await disconnectWallet();
  };

  const displayAddress = paymentAddress ? `${paymentAddress.slice(0, 3)}...${paymentAddress.slice(-5)}` : '';

  return (
    <header className="bg-black text-white font-bold p-3 fixed left-0 top-0 right-0 w-full z-30">
      <div className='flex justify-between items-center max-w-6xl mx-auto relative'>
        <div className='w-24 sm:w-32'>
          <NetworkSwitch />
        </div>
        <div className='w-full italic text-2xl sm:text-3xl text-center'>
          <img src={sandsend} alt="Sandsend" className="w-60 h-auto mx-auto" />
        </div>
        {isConnected ? (
          <div className='w-24 sm:w-32 p-1 text-sm sm:text-base text-white text-center'>
            <div><Button onClick={handleDisconnectClick} title={displayAddress}/></div>
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