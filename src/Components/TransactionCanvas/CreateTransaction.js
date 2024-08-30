import React from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import useCreatePSBT from '../../Hooks/useCreatePSBT';
import Button from '../Button'

const CreateTransaction = () => {
  const { input, outputs } = useTransaction();
  const { createPSBT } = useCreatePSBT();

  const handleCreateTransaction = () => {
    const psbtInputs = input.map(input => ({
      tx_hash: input.txid,
      tx_output_n: input.vout,
      value: input.value
    }));

    const psbtOutputs = outputs.map(output => ({
      address: output.address,
      value: output.amount
    }));

    const psbtB64 = createPSBT(psbtInputs, psbtOutputs);
    console.log('PSBT Base64:', psbtB64);
  };

  return (
    <>
      <Button
        title='create PSBT'
        className='font-bold fixed w-38 m-8 p-1 text-white text-center rounded text-white bg-lime-700 p-2 bottom-10 right-4 hover:bg-lime-800 z-20'
        onClick={handleCreateTransaction}
      />
    </>
  );
};

export default CreateTransaction;