import React, { useState } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';

const OutputElement = ({ address }) => { // Деструктурируем utxoKey из пропсов
    const [showUtxo, setShowUtxo] = useState(false);

    return (
        <>
           <Button onClick={() => setShowUtxo(!showUtxo)} className='rounded-xl hover:bg-orange-700 bg-orange-600 text-white p-3 w-32 h-12 shadow-md' title={`${address.slice(0, 3)}...${address.slice(-6)}`} /> {/* Передаем utxoKey как title */}
           <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
            <ModalHeader title='OUTPUT'/>
           </Modal>
        </>
    );
};

export default OutputElement;