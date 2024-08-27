import { useCallback } from 'react';
import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';

// Кастомный хук для подключения кошелька
const useConnectWallet = () => {
  const connectWallet = useCallback(async () => {
    try {
      const options = {
        purposes: ['payment', 'ordinals'],
        message: "We need access to your wallet addresses to proceed.",
      };

      const response = await request('getAccounts', options);

      if (response.status === 'success') {
        const walletAddresses = {};

        const paymentAddressItem = response.result.find(
          (address) => address.purpose === AddressPurpose.Payment
        );

        const ordinalsAddressItem = response.result.find(
          (address) => address.purpose === AddressPurpose.Ordinals
        );

        if (paymentAddressItem) {
          walletAddresses[AddressPurpose.Payment] = paymentAddressItem;
        }

        if (ordinalsAddressItem) {
          walletAddresses[AddressPurpose.Ordinals] = ordinalsAddressItem;
        }

        localStorage.setItem('walletAddresses', JSON.stringify(walletAddresses));
        console.log('CONNECT Wallet', walletAddresses);

        return { 
          success: true, 
          paymentAddress: paymentAddressItem ? paymentAddressItem.address : null 
        };
      } else {
        if (response.error.code === RpcErrorCode.USER_REJECTION) {
          console.error('User canceled the request');
        } else {
          console.error('Error:', response.error.message);
        }
        return { success: false, error: response.error.message };
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return { connectWallet };
};

export default useConnectWallet;