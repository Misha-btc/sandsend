import React, { useEffect } from 'react';

function TransactionCanvas() {
    useEffect(() => {
        // Отключаем прокрутку при монтировании компонента
        document.body.style.overflow = 'hidden';

        // Включаем прокрутку обратно при размонтировании компонента
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="flex-grow flex justify-center items-center overflow-auto w-full h-full">
            {/* Ваша логика для интерактивного канваса */}
            <p>Interactive Canvas Area</p>
        </div>
    );
}

export default TransactionCanvas;