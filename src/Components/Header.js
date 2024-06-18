import React from 'react';
import Button from './Button';

function Header() {
    return (
        <header className="bg-black text-white font-bold p-3 fixed left-0 top-0 right-0 w-full z-10">
            <div className='flex justify-between items-center'>
                <div className='w-32'></div> {/* Пустой элемент для центровки */}
                <span className='italic text-3xl text-center'>
                    satributiq
                </span>
                <Button title='connect' className='w-32 p-1 text-white text-center rounded hover:bg-zinc-900'/>
            </div>
        </header>
    );
}

export default Header;