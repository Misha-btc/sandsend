import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';
import CreateTransaction from './Components/TransactionCanvas/CreateTransaction';

function App() {
  return (
      <React.StrictMode>
        <Header />
              <AddUtxo />
              <CreateTransaction />
              <TransactionCanvas />
        <Footer />
      </React.StrictMode>
  );
}

export default App;