import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';
import SettingRanges from './SettingRanges';
import { useChoice } from '../../Contexts/ChosenUtxo';

const InputElement = ({ utxoKey, containerRef }) => {
    const [showUtxo, setShowUtxo] = useState(false);
    const elementRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { updatePosition } = useChoice();

    const computePosition = () => {
        if (elementRef.current && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const elementRect = elementRef.current.getBoundingClientRect();
            const newPosition = {
                x: elementRect.left - containerRect.left,
                y: elementRect.top - containerRect.top
            };
            setPosition(newPosition);
            updatePosition(utxoKey, newPosition); // Обновляем позицию в контексте
        }
    };

    useEffect(() => {
        computePosition();
        window.addEventListener('resize', computePosition);
        window.addEventListener('scroll', computePosition, true);

        return () => {
            window.removeEventListener('resize', computePosition);
            window.removeEventListener('scroll', computePosition, true);
        };
    }, []);

    useEffect(() => {
        if (elementRef.current) {
            computePosition();
        }
    }, [elementRef, containerRef]); // Убедимся, что позиция обновляется при первом рендере

    return (
        <>
            <div ref={elementRef} className='relative z-20'>
                <Button onClick={() => setShowUtxo(!showUtxo)} className='rounded-xl hover:bg-zinc-300 bg-zinc-200 text-black p-3 w-32 h-12 shadow-md hover:drop-shadow-xl' title={`${utxoKey.slice(0, 3)}...${utxoKey.slice(-6)}`} />
            </div>
            <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
                <ModalHeader title='sat ranges'/>
                <p>Position: {`x: ${position.x}, y: ${position.y}`}</p>
                <SettingRanges dataKey={utxoKey}/>
            </Modal>
        </>
    );
};

export default InputElement;