import React from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import Button from '../Button'

const SignPSBT = () => {


  return (
    <>
      <Button
        title='sign PSBT'
        className='
            font-bold 
            fixed 
            w-38 
            m-8 
            p-1 
            text-white 
            text-center 
            rounded 
            text-white bg-lime-700 p-2 bottom-10 left-1/2 transform -translate-x-1/2 hover:bg-lime-800 z-20'
        onClick={1}
      />
    </>
  );
};

export default SignPSBT;