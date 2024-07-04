import React, { useRef, useEffect, useState } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import InputElement from './InputElement';

const SelectedUtxos = ({ containerInfo }) => {
    const { choice } = useChoice();
    const containerRef = useRef(null);
    const [containerPosition, setContainerPosition] = useState({ left: 0, top: 0 });

    const computeContainerPosition = () => {
        if (containerRef.current && containerInfo.width > 0 && containerInfo.height > 0) {
            const rect = containerRef.current.getBoundingClientRect();
            const newPosition = {
                left: rect.left - containerInfo.left,
                top: rect.top - containerInfo.top
            };
            console.log("Container position:", newPosition); // Debugging log
            setContainerPosition(newPosition);
        }
    };

    useEffect(() => {
        computeContainerPosition();
    }, [containerInfo]);

    return (
        <div ref={containerRef} className='w-full h-full p-20 flex flex-col min-h-screen m-6 items-center'>
            {Object.keys(choice).map(key => (
                <div key={key} className="mb-6 w-32 h-12 rounded-xl">
                    <InputElement utxoKey={key} containerRef={containerRef} containerInfo={containerInfo} containerPosition={containerPosition} />
                </div>
            ))}
        </div>
    );
};

export default SelectedUtxos;