import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './state/configureStore';

import DashboardGrid from './components/DashboardGrid';

import { initCommunication } from './backendCommunication/initCommunication';

import './index.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

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
