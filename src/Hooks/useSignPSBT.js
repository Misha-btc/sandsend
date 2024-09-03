import { request, RpcErrorCode } from 'sats-connect';
import * as btc from '@scure/btc-signer';
import { useTransaction } from '../Contexts/TransactionContext';

const useSignPSBT = () => {
  const { input } = useTransaction();

  return async (psbtBase64, broadcast = false) => {
    const signInputs = {};

    input.forEach((input, index) => {
      if (!signInputs[input.address]) {
        signInputs[input.address] = [];
      }
      signInputs[input.address].push(index);
    });
    console.log('signInputs', signInputs);

    try {
      const response = await request('signPsbt', {
        psbt: psbtBase64,
        allowedSignHash: btc.SigHash.ALL,
        signInputs: signInputs,
        broadcast: broadcast
      });
      if (response.status === "success") {
        console.log('PSBT успешно подписан');
        return response.result;
      } else {
        if (response.error.code === RpcErrorCode.USER_REJECTION) {
          throw new Error('Пользователь отменил подписание');
        } else {
          console.log(response.error);
          throw new Error('Ошибка при подписании PSBT');
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export default useSignPSBT;