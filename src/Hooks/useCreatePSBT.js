/* global BigInt */
import * as btc from '@scure/btc-signer';
import { hex, base64 } from '@scure/base';

const bitcoinMainnet = {
  bech32: 'bc',
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

// Пример внутреннего публичного ключа для Taproot адреса
const internalPubKey = hex.decode("b9907521ddb85e0e6a37622b7c685efbdc8ae53a334928adbd12cf204ad4e717");

const useCreatePSBT = () => {
  const createPSBT = (inputs, outputs) => {
    const p2tr = btc.p2tr(internalPubKey, undefined, bitcoinMainnet);

    // Инициализация транзакции
    const tx = new btc.Transaction();

    // Добавление входов
    inputs.forEach(input => {
      tx.addInput({
        txid: input.tx_hash,
        index: input.tx_output_n,
        witnessUtxo: {
          script: p2tr.script,
          amount: BigInt(input.value),
        },
        tapInternalKey: internalPubKey,
        sighashType: btc.SigHash.SINGLE_ANYONECANPAY
      });
    });

    // Добавление выходов
    outputs.forEach(output => {
      tx.addOutputAddress(output.address, BigInt(output.value), bitcoinMainnet);
    });

    // Генерация PSBT в формате base64
    const psbt = tx.toPSBT(0);
    const psbtB64 = base64.encode(psbt);

    console.log('Base64 Encoded PSBT:', psbtB64);

    return psbtB64;
  };

  return { createPSBT };
};

export default useCreatePSBT;