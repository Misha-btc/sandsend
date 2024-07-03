import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChoiceProvider } from './Contexts/ChosenUtxo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChoiceProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChoiceProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
