import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { init as initApm } from '@elastic/apm-rum';

import { configureStore } from './state/configureStore';

import DashboardGrid from './components/DashboardGrid';

import { initCommunication } from './backendCommunication/initCommunication';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import './index.css';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DashboardGrid />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

store.dispatch(initCommunication());

if (!(window as any).Cypress) {
  initApm({
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: 'Cpu Load Monitoring',

    serverUrl:
      'https://514ec779bcab43f2b36afd567105afff.apm.us-central1.gcp.cloud.es.io:443',

    serviceVersion: '1.0',

    environment:
      process.env.NODE_ENV === 'development' ? 'development' : 'production',
  });
}
