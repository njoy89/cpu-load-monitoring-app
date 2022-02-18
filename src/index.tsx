import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './state/configureStore';

import DashboardGrid from './components/DashboardGrid';

import './index.css';
import { initCommunication } from './backendCommunication/initCommunication';

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
