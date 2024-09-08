import React, { useEffect } from 'react';
import Button from './Button';
import { useWallet } from '../Contexts/WalletContext';
import sandsend from '../icons/sandsend.jpeg';
import NetworkSwitch from './NetworkSwitch';
import useFetchUtxos from '../Hooks/useFetchUtxos';
import { useTransaction } from '../Contexts/TransactionContext';
function Header() {
  const { connectWallet, disconnectWallet, isConnected, paymentAddress, balance, error, setError } = useWallet();
  const { removeAll } = useTransaction();
  const { fetchAllData } = useFetchUtxos();

  useEffect(() => {
    if (isConnected && paymentAddress && balance !== 0 && !error && balance !== null) {
      fetchAllData();
    }
  }, [isConnected, paymentAddress, fetchAllData, balance, error]);

  const handleConnectClick = async () => {
    setError(null);
    await connectWallet();
  };

  const handleDisconnectClick = async () => {
    setError(null);
    removeAll()
    await disconnectWallet();
  };


  const displayAddress = paymentAddress ? `${paymentAddress.slice(0, 3)}...${paymentAddress.slice(-5)}` : '';

  return (
    <header className="bg-black text-white font-bold p-2 fixed left-0 top-0 right-0 w-full z-30">
      <div className='flex justify-between items-center max-w-6xl mx-auto relative h-12'>
        <div className='w-24 sm:w-32 h-full flex items-center justify-start'>
          {!isConnected && <NetworkSwitch />}
        </div>
        <div className='flex-grow italic text-xl sm:text-2xl text-center h-full flex items-center justify-center'>
          <img src={sandsend} alt="Sandsend" className="w-40 h-auto" />
        </div>
        <div className='w-24 sm:w-32 h-full flex items-center justify-end'>
          {isConnected && !error ? (
            <div className='text-xs sm:text-sm text-white text-center'>
              <div><Button onClick={handleDisconnectClick} title={displayAddress}/></div>
              <div className='text-xs mt-0.5'>{balance} sats</div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <Button 
                onClick={handleConnectClick} 
                title='connect' 
                className='w-full p-1 text-xs sm:text-sm text-white text-center rounded hover:bg-zinc-900 hover:text-glow'
              />
              {error && <div className="text-red-500 text-center text-[8px] mt-0.5">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;