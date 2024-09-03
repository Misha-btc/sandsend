import React, { useState } from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import useCreatePSBT from '../../Hooks/useCreatePSBT';
import Button from '../Button'
import useSignPSBT from '../../Hooks/useSignPSBT';

const CreateTransaction = () => {
  
  const { input, outputs } = useTransaction();
  const { createPSBT } = useCreatePSBT();
  const signPSBT = useSignPSBT();
  const [psbt, setPsbt] = useState(null);
  const [signedPsbt, setSignedPsbt] = useState(null);
  const [txid, setTxid] = useState(null);

  const handleCreateTransaction = () => {
    const psbtInputs = input.map(input => ({
      tx_hash: input.txid,
      addressType: input.addressType,
      pubkey: input.publicKey,
      tx_output_n: Number(input.vout), // Преобразуем в number
      value: input.value
    }));

    const psbtOutputs = outputs.map(output => ({
      address: output.address,
      value: output.amount
    }));

    console.log('Inputs:', psbtInputs);
    console.log('Outputs:', psbtOutputs);
    console.log('Input Values:', input.map(input => input.value));
    console.log('Output Values:', outputs.map(output => output.amount));

    const psbtB64 = createPSBT(psbtInputs, psbtOutputs, true);
    console.log('PSBT Base64:', psbtB64);
    setPsbt(psbtB64);
  };

  const handleSignTransaction = async (broadcast = false) => {
    try {
      if (psbt) {
        const result = await signPSBT(psbt, broadcast);
        console.log('Результат подписания:', result);
        if (broadcast && result.txid) {
          setTxid(result.txid);
          console.log('Транзакция отправлена в сеть. TXID:', result.txid);
        } else {
          setSignedPsbt(result.psbt);
        }
      } else {
        console.error('PSBT не создан');
      }
    } catch (error) {
      console.error('Ошибка при подписании PSBT:', error);
    }
  };

  return (
    <>
    {!psbt && (
      <Button
        title='Создать PSBT'
        className='font-bold fixed w-38 m-8 p-1 text-white text-center rounded text-white bg-lime-700 p-2 bottom-10 right-4 hover:bg-lime-800 z-20'
        onClick={handleCreateTransaction}
      />
    )}
    {psbt && !signedPsbt && !txid && (
      <div className='fixed bottom-10 right-4 flex flex-col gap-2'>
        <Button
          title='Подписать PSBT'
          className='font-bold w-38 p-1 text-white text-center rounded text-white bg-lime-700 hover:bg-lime-800 z-20'
          onClick={() => handleSignTransaction(false)}
        />
        <Button
          title='Подписать и отправить'
          className='font-bold w-38 p-1 text-white text-center rounded text-white bg-orange-700 hover:bg-orange-800 z-20'
          onClick={() => handleSignTransaction(true)}
        />
      </div>
    )}
    {signedPsbt && (
      <div className='fixed bottom-10 right-4 text-white bg-lime-700 p-2 rounded'>
        PSBT подписан: {signedPsbt.slice(0, 20)}...
      </div>
    )}
    {txid && (
      <div className='fixed bottom-10 right-4 text-white bg-orange-700 p-2 rounded'>
        Транзакция отправлена. TXID: {txid.slice(0, 20)}...
      </div>
    )}
    </>
  );
};

export default CreateTransaction;