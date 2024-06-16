import React, { useState } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';
import SettingRanges from './SettingRanges';

const InputElement = ({ utxoKey }) => { // Деструктурируем utxoKey из пропсов
    const [showUtxo, setShowUtxo] = useState(false);

    return (
        <>
           <Button onClick={() => setShowUtxo(!showUtxo)} className='rounded-xl bg-black text-white p-3 w-32 h-12 shadow-md' title={`${utxoKey.slice(0, 3)}...${utxoKey.slice(-6)}`} /> {/* Передаем utxoKey как title */}
           <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
            <ModalHeader title='Sat Ranges'/>
            <SettingRanges dataKey={utxoKey}/>
           </Modal>
        </>
    );
};

export default InputElement;