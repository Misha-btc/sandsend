import React, { useState } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';
import SettingRanges from './SettingRanges';

const InputElement = ({ utxoKey }) => {
  const [showUtxo, setShowUtxo] = useState(false);

  return (
    <>
      <div>
        <Button 
          onClick={() => setShowUtxo(!showUtxo)} 
          className='mt-10 rounded-xl hover:bg-zinc-300 z-10 relative bg-zinc-200 text-black p-3 w-32 h-12 shadow-md hover:drop-shadow-xl' 
          title={`${utxoKey.slice(0, 3)}...${utxoKey.slice(-6)}`} 
        />
        <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
          <ModalHeader title='sat ranges'/>
          <SettingRanges dataKey={utxoKey} />
        </Modal>
      </div>
    </>
  );
};

export default InputElement;