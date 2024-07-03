import React, { useRef } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import InputElement from './InputElement';

const SelectedUtxos = () => {
    const { choice } = useChoice(); // Используем контекст для доступа к выбранным UTXO и функции их удаления
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className='w-full h-full p-10 flex flex-col min-h-screen m-6 items-center'>
            {Object.keys(choice).map(key => (
                <div key={key} className="mb-2 w-32 h-12 rounded-xl">
                    <InputElement utxoKey={key} containerRef={containerRef}/>
                </div>
            ))}
        </div>
    );
};

export default SelectedUtxos;