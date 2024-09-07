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
            console.log('newUtxos', newUtxos);
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
        console.log('fetchAllData', isConnected, paymentAddress, ordinalsAddress);
        console.log('localStorage', localStorage);
        if (!isConnected || (!paymentAddress && !ordinalsAddress)) {
            setTransactionDetails({});
            setUtxos({});
            localStorage.clear();
            return;
        }
        setLoading(true);
        try {
            const fetchedUtxos = await fetchUtxos();
            console.log('fetchedUtxos', fetchedUtxos);
            if (fetchedUtxos) {
                await fetchTransactionDetails(fetchedUtxos);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchUtxos, fetchTransactionDetails, isConnected, paymentAddress, ordinalsAddress]);

    useEffect(() => {
        const storedDetails = localStorage.getItem('transactionDetails');
        console.log('useEffect storedDetails:', storedDetails);
        console.log('useEffffff:', localStorage);
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