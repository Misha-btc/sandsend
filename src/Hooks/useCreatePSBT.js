/* global BigInt */
import * as btc from '@scure/btc-signer';
import { hex, base64 } from '@scure/base';

// Дописать конфигурации для других типов адрессов отличных от p2tr в Mainnet
const bitcoinMainnet = {
  bech32: 'bc',
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

const bitcoinSignet = {
  bech32: 'tb',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

const useCreatePSBT = () => {
  const createPSBT = (inputs, outputs, signet) => {
    const network = signet ? bitcoinSignet : bitcoinMainnet;

    // Инициализация транзакции
    const tx = new btc.Transaction();

    inputs.forEach(input => {
      const pubkey = hex.decode(input.pubkey);
      const addressType = input.addressType;

      let unlockingScript;

      if (addressType === 'p2tr') {
        unlockingScript = btc[addressType](pubkey, undefined, network);
        tx.addInput({
          txid: input.tx_hash,
          index: input.tx_output_n,
          witnessUtxo: {
            script: unlockingScript.script,
            amount: BigInt(input.value),
          },
          tapInternalKey: pubkey,
          sighashType: btc.SigHash.ALL
        });

      } else if (addressType === 'p2sh') {
        const p2wpkh = btc.p2wpkh(pubkey, network);
        const unlockingScript = btc[addressType](p2wpkh, network);
        tx.addInput({
          txid: input.tx_hash,
          index: input.tx_output_n,
          witnessUtxo: {
            script: unlockingScript.script,
            amount: BigInt(input.value),
          },
          redeemScript: unlockingScript.redeemScript,
          sighashType: btc.SigHash.ALL
        });

      } else if (addressType === 'p2wpkh') {
        unlockingScript = btc[addressType](pubkey, network);
        tx.addInput({
          txid: input.tx_hash,
          index: input.tx_output_n,
          witnessUtxo: {
            script: unlockingScript.script,
            amount: BigInt(input.value),
          },
          redeemScript: unlockingScript.redeemScript,
          sighashType: btc.SigHash.ALL
        });
      }
    });

    // Добавление выходов
    outputs.forEach(output => {
      tx.addOutputAddress(output.address, BigInt(output.value), network);
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