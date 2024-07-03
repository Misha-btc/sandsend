import React from "react";

export function ModalHeader({title}) {
    return(
        <div className='flex items-center border-b p-2 bg-black text-white sticky top-0 z-30 font-black text-xl'>
            <div className='w-full text-center'>{title}</div> {/* Заголовок по центру */}
        </div>
    );
}

export default ModalHeader;