import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(console.log);

const socket = new WebSocket('ws://localhost:8080', 'protocolOne');

socket.addEventListener('open', (message) => {
  socket.send(
    JSON.stringify({
      type: 'initTimeout',
      timeout: 1000,
    })
  );
});

socket.addEventListener('message', (message) => {
  console.log(JSON.parse(message.data));
});

console.log(process.env.NODE_ENV);
