import React, { useEffect } from 'react';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import sandsend from '../icons/sandsend.jpeg';
import NetworkSwitch from './NetworkSwitch';
import useFetchUtxos from '../Hooks/useFetchUtxos';

function Header() {
  const { connectWallet, disconnectWallet, isConnected, paymentAddress, balance, error, setError } = useWallet();
  const { fetchAllData } = useFetchUtxos();

  useEffect(() => {
    if (isConnected && paymentAddress && balance !== null && !error) {
      console.log('fetching all data' , paymentAddress, balance, error, isConnected);
      fetchAllData(paymentAddress);
    }
  }, [isConnected, paymentAddress, fetchAllData, balance, error]);

  const handleConnectClick = async () => {
    setError(null);
    await connectWallet();
  };

  const handleDisconnectClick = async () => {
    setError(null);
    await disconnectWallet();
  };

  const displayAddress = paymentAddress ? `${paymentAddress.slice(0, 3)}...${paymentAddress.slice(-5)}` : '';

  return (
    <header className="bg-black text-white font-bold p-3 fixed left-0 top-0 right-0 w-full z-30">
      <div className='flex justify-between items-center max-w-6xl mx-auto relative'>
        {!isConnected && (
          <div className='w-24 sm:w-32'>
            <NetworkSwitch />
          </div>
        )}
        <div className='w-full italic text-2xl sm:text-3xl text-center'>
          <img src={sandsend} alt="Sandsend" className="w-60 h-auto mx-auto" />
        </div>
        {isConnected && !error ? (
          <div className='w-24 sm:w-32 p-1 text-xs sm:text-base text-white text-center'>
            <div><Button onClick={handleDisconnectClick} title={displayAddress}/></div>
            <div className='text-xs'>{balance} sats</div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Button 
              onClick={handleConnectClick} 
              title='connect' 
              className='w-24 sm:w-32 p-1 text-sm sm:text-base text-white text-center rounded hover:bg-zinc-900 hover:text-glow'
            />
            {error && <div className="text-red-500 text-center text-[8px] mt-1">{error}</div>}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;