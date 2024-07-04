import React, { useRef, useEffect, useState } from 'react';
import SelectedUtxos from './SelectedUtxos';
import OutputsSpace from './OutputsSpace';
import Lines from './Lines';

function TransactionCanvas() {
    const containerRef = useRef(null);
    const [containerInfo, setContainerInfo] = useState({
        width: 0,
        height: 0,
        left: 0,
        top: 0
    });

    const updateContainerInfo = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerInfo({
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top
            });
        }
    };

    useEffect(() => {
        updateContainerInfo(); // Update container info initially
        window.addEventListener('resize', updateContainerInfo); // Update container info on window resize

        return () => {
            window.removeEventListener('resize', updateContainerInfo); // Clean up event listener on unmount
        };
    }, []);

    return (
        <div ref={containerRef} className="flex h-full">
            <Lines containerInfo={containerInfo} />
            <div className="w-1/2 h-full bg-zinc-900">
                <SelectedUtxos containerInfo={containerInfo} />
            </div>
            <div className="w-1/2 h-full bg-zinc-900">
                <OutputsSpace containerInfo={containerInfo} />
            </div>
        </div>
    );
}

export default TransactionCanvas;