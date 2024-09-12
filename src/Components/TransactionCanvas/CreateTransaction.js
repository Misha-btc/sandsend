import React, { useState, useEffect } from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import useCreatePSBT from '../../Hooks/useCreatePSBT';
import Button from '../Button'
import useSignPSBT from '../../Hooks/useSignPSBT';
import { useWallet } from '../../Contexts/WalletContext';
import { useFees } from '../../Contexts/feesContext';

const CreateTransaction = () => {
  const { input, outputs, edit, change } = useTransaction();
  const { totalFee } = useFees();
  const { createPSBT } = useCreatePSBT();
  const signPSBT = useSignPSBT();
  const { isConnected, paymentAddress, paymentAddressType, publicKey } = useWallet();
  const [psbt, setPsbt] = useState(null);
  const [signedPsbt, setSignedPsbt] = useState(null);
  const [txid, setTxid] = useState(null);

  console.log('signedPsbt', signedPsbt);

  useEffect(() => {
    setPsbt(null);
    setSignedPsbt(null);
    setTxid(null);
  }, [input, outputs]);

  if (!isConnected) {
    return null;
  }

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




/*     if (change < totalFee) {
      psbtInputs.push({
        tx_hash: 'dummy_txid_for_change',
        addressType: paymentAddressType,
        pubkey: publicKey,
        tx_output_n: 0,
        value: change
      });
    } */

    // Добавляем дополнительный выход, если (change - fee) > 600
    if (change - totalFee > 1000) {
      psbtOutputs.push({
        address: paymentAddress,
        value: change - totalFee
      });
    }

    const psbtB64 = createPSBT(psbtInputs, psbtOutputs);
    console.log('PSBT Base64:', psbtB64);
    setPsbt(psbtB64);
  };

  const handleSignTransaction = async (broadcast = false) => {
    try {
      if (psbt) {
        const result = await signPSBT(psbt, broadcast);
        if (broadcast && result.txid) {
          setTxid(result.txid);
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
        title='Create PSBT'
        className='font-bold fixed w-38 m-8 p-1 text-white text-center rounded text-white bg-green-600 p-2 bottom-10 right-4 hover:bg-green-500 z-20'
        onClick={handleCreateTransaction}
        disabled={edit}
      />
    )}
    {psbt && !signedPsbt && !txid && (
      <div className='fixed bottom-10 right-4 flex flex-col gap-2'>
        <Button
          title='Sign PSBT'
          className='font-bold w-38 p-1 text-white text-center rounded text-white bg-lime-700 hover:bg-lime-800 z-20'
          onClick={() => handleSignTransaction(false)}
        />
        <Button
          title='Sign and Send'
          className='font-bold w-38 p-1 text-white text-center rounded text-white bg-orange-700 hover:bg-orange-800 z-20'
          onClick={() => handleSignTransaction(true)}
        />
      </div>
    )}
    {signedPsbt && (
      <div className='fixed bottom-10 right-4 text-white bg-lime-700 p-2 rounded'>
        PSBT signed: {signedPsbt.slice(0, 20)}...
      </div>
    )}
    {txid && (
      <div className='fixed bottom-10 right-4 text-white bg-orange-700 p-2 rounded'>
        Transaction sent. TXID: {txid.slice(0, 20)}...
      </div>
    )}
    </>
  );
};

export default CreateTransaction;