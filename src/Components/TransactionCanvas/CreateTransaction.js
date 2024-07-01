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
      className='fixed text-white bg-green-800 p-2 bottom-10 right-4 hover:bg-green-700 z-10'
      onClick={handleCreateTransaction}
    >
      Create Transaction
    </button>
  );
};

export default CreateTransaction;