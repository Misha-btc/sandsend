import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';
import CreateTransaction from './Components/TransactionCanvas/CreateTransaction';
import AddRecipient from './Components/AddRecipient';

function App() {
  return (
      <React.StrictMode>
        <Header />
              <AddUtxo />
              <AddRecipient />
              <CreateTransaction />
              <TransactionCanvas />
        <Footer />
      </React.StrictMode>
  );
}

export default App;