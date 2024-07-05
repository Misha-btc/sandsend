import React from 'react';
import Button from './Button';
import useConnectWallet from '../Hooks/useConnectWallet';
import '../index.css'

function Header() {
  const connectWallet = useConnectWallet();

  return (
    <header className="bg-black text-white font-bold p-3 fixed left-0 top-0 right-0 w-full z-30">
      <div className='flex justify-between items-center'>
        <div className='w-32'></div> {/* Пустой элемент для центровки */}
        <span className='italic text-3xl text-center'>
          sandsend<span className='text-orange-600 text-lg align-top'>サンド</span>
        </span>
        <Button onClick={connectWallet} title='connect' className='w-32 p-1 text-white text-center rounded hover:bg-zinc-900 hover:text-glow'/>
      </div>
    </header>
  );
}

export default Header;