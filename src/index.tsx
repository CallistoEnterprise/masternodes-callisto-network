import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  return library
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
