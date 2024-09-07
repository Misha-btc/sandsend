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
            return;
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

        Promise.all(fetchPromises)
            .then(responses => {
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
            })
            .catch(error => {
                console.error('Error fetching UTXOs:', error);
                setLoading(false);
            });
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
        if (!isConnected || (!paymentAddress && !ordinalsAddress)) {
            return;
        }
        setLoading(true);
        try {
            const fetchedUtxos = await fetchUtxos();
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
        console.log('useEffect transactionDetails: and isConnected:', transactionDetails, isConnected);
        const storedDetails = localStorage.getItem('transactionDetails');
        console.log('useEffect storedDetails:', storedDetails);
        if (storedDetails && isConnected) {
            try {
                const parsedDetails = JSON.parse(storedDetails);
                if (typeof parsedDetails === 'object' && parsedDetails !== null) {
                    setTransactionDetails(parsedDetails);
                }
            } catch (error) {
                console.error('Error parsing stored transaction details:', error);
            }
        } else {
            setTransactionDetails({});
        }
    }, [isConnected]);

    useEffect(() => {
        console.log('useEffect utxos:', utxos, isConnected);
        if (Object.values(utxos).flat().length > 0 && isConnected) {
            fetchTransactionDetails(utxos);
        } else {
            setTransactionDetails({});
            setUtxos({});
        }
    }, [fetchTransactionDetails, isConnected]);


    return { utxos, loading, fetchAllData, transactionDetails };
};

export default useFetchUtxos;