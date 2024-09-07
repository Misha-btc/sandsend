import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '../Contexts/WalletContext';
import { useNetwork } from '../Contexts/NetworkContext';

const useFetchUtxos = () => {
    const { url } = useNetwork();
    const [utxos, setUtxos] = useState({});
    const [loading, setLoading] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState({});
    const { 
        paymentAddress, 
        ordinalsAddress, 
        isConnected, 
        paymentAddressType, 
        ordinalsAddressType, 
        publicKey, 
        ordinalsPublicKey 
    } = useWallet();

    const fetchUtxos = useCallback(async () => {
        setLoading(true);

        if (!paymentAddress && !ordinalsAddress && !isConnected) {
            setTransactionDetails({});
            setLoading(false);
            return {};
        }

        const addresses = [
            { purpose: 'payment', address: paymentAddress },
            { purpose: 'ordinals', address: ordinalsAddress }
        ].filter(addr => addr.address);

        const fetchPromises = addresses.map(addr =>
            axios.post(url, {
                jsonrpc: "2.0",
                id: 1,
                method: "esplora_address::utxo",
                params: [addr.address]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        );

        try {
            const responses = await Promise.all(fetchPromises);
            const newUtxos = {};
            responses.forEach((response, index) => {
                const addressObj = addresses[index];
                const key = `${addressObj.address}:${addressObj.purpose}`;
                if (response.data && Array.isArray(response.data.result)) {
                    newUtxos[key] = response.data.result;
                } else {
                    newUtxos[key] = [];
                }
            });
            setUtxos(newUtxos);
            setLoading(false);
            return newUtxos;
        } catch (error) {
            console.error('Error fetching UTXOs:', error);
            setLoading(false);
            return {};
        }
    }, [url, paymentAddress, ordinalsAddress, isConnected]);

    const fetchTransactionDetails = useCallback(async (fetchedUtxos) => {
        if (!fetchedUtxos || Object.keys(fetchedUtxos).length === 0 || !isConnected) return;
        const txidVoutMap = {};
        const txidVoutArray = [];
        Object.entries(fetchedUtxos).forEach(([key, utxoList]) => {
            utxoList.forEach(utxo => {
                const txidVoutKey = `${utxo.txid}:${utxo.vout}`;
                txidVoutMap[txidVoutKey] = key;
                txidVoutArray.push(["ord_output", [txidVoutKey]]);
            });
        });
        
        try {
            const response = await axios.post(url, {
                jsonrpc: "2.0",
                id: 1,
                method: "sandshrew_multicall",
                params: txidVoutArray
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const newTransactionDetails = {};
            if (response.data && Array.isArray(response.data.result)) {
                response.data.result.forEach((res, index) => {
                    if (res.result) {
                        const key = txidVoutArray[index][1][0];
                        const mapValue = txidVoutMap[key];
                        if (!newTransactionDetails[mapValue]) {
                            newTransactionDetails[mapValue] = {};
                        }
                        const [address, purpose] = mapValue.split(':');
                        newTransactionDetails[mapValue][key] = {
                            ...res.result,
                            address,
                            addressType: purpose === 'payment' ? paymentAddressType : ordinalsAddressType,
                            publicKey: purpose === 'payment' ? publicKey : ordinalsPublicKey
                        };
                    }
                });
                setTransactionDetails(newTransactionDetails);
                localStorage.setItem('transactionDetails', JSON.stringify(newTransactionDetails));
                return newTransactionDetails;
            }
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            throw error;
        }
    }, [url, paymentAddressType, ordinalsAddressType, publicKey, ordinalsPublicKey, isConnected]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedUtxos = await fetchUtxos();
            if (fetchedUtxos && Object.keys(fetchedUtxos).length > 0) {
                await fetchTransactionDetails(fetchedUtxos);
            } else {
                setTransactionDetails({});
                localStorage.removeItem('transactionDetails');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setTransactionDetails({});
            setUtxos({});
            localStorage.removeItem('transactionDetails');
        } finally {
            setLoading(false);
        }
    }, [fetchUtxos, fetchTransactionDetails]);

    useEffect(() => {
        let timeoutId;
        if (!isConnected) {
            timeoutId = setTimeout(() => {
                setUtxos({});
                setTransactionDetails({});
                localStorage.removeItem('transactionDetails');
            }, 1000); // 1 секунда задержки
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isConnected]);

    useEffect(() => {
        const storedDetails = localStorage.getItem('transactionDetails');
        if (storedDetails) {
            try {
                const parsedDetails = JSON.parse(storedDetails);
                if (typeof parsedDetails === 'object' && parsedDetails !== null) {
                    setTransactionDetails(parsedDetails);
                }
            } catch (error) {
                console.error('Error parsing stored transaction details:', error);
            }
        }
    }, []);

    return { utxos, loading, fetchAllData, transactionDetails, setTransactionDetails, setUtxos };
};

export default useFetchUtxos;