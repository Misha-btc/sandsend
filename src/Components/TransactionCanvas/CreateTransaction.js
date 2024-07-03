import React from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import useCreatePSBT from '../../Hooks/useCreatePSBT';

const CreateTransaction = () => {
  const { choice } = useChoice();
  const { createPSBT } = useCreatePSBT();

  const handleCreateTransaction = () => {
    const inputs = [];
    const outputs = [];

    // Проходим по всем элементам choice и формируем входы и выходы
    Object.keys(choice).forEach(txidVout => {
      const utxo = choice[txidVout];
      inputs.push({
        tx_hash: utxo.txid,
        tx_output_n: utxo.vout,
        value: utxo.value
      });

      // Добавляем new_ranges как выходы
      Object.keys(utxo.new_ranges).forEach(rangeIndex => {
        utxo.new_ranges[rangeIndex].forEach(range => {
          if (range.address) {
            outputs.push({
              address: range.address,
              value: range.sats
            });
          }
        });
      });
    });

    // Создаем PSBT
    const psbtB64 = createPSBT(inputs, outputs);
    console.log('PSBT Base64:', psbtB64);
  };

  return (
    <button
      className='font-bold fixed w-38 m-8 p-1 text-white text-center rounded text-white bg-lime-700 p-2 bottom-10 right-4 hover:bg-lime-800 z-10'
      onClick={handleCreateTransaction}
    >
      create PSBT
    </button>
  );
};

export default CreateTransaction;