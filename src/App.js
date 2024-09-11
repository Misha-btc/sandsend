import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';
import { TransactionProvider } from './Contexts/TransactionContext';
import { WalletProvider } from './Contexts/WalletContext';
import { NetworkProvider } from './Contexts/NetworkContext';
import { FeesProvider } from './Contexts/feesContext';

function App() {
  return (
    <React.StrictMode>
      <NetworkProvider>
        <WalletProvider>
          <TransactionProvider>
            <FeesProvider>
              <Header />
              <AddUtxo />
              <TransactionCanvas />
              <Footer />
            </FeesProvider>
          </TransactionProvider>
        </WalletProvider>
      </NetworkProvider>
    </React.StrictMode>
  );
}

export default App;