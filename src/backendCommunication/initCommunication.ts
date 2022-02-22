import type { ActionCreator } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import { FETCH_TIMEOUT, WS_ADDRESS } from '../constants';
import type { State } from './../state/state.type';
import type { Action } from './../state/actions';
import type { IncomingAction, OutgoingAction } from './actions';
import { initCypress } from './initCypress';

export const initCommunication: ActionCreator<
  ThunkAction<void, State, undefined, Action>
> = () => (dispatch, getState) => {
  if ((window as any).Cypress) {
    initCypress(dispatch);
    return;
  }

  const socket = new WebSocket(WS_ADDRESS);

  socket.addEventListener('open', (message) => {
    const initTimeoutAction: OutgoingAction = {
      type: 'init',
      timeout: FETCH_TIMEOUT,
    };

    socket.send(JSON.stringify(initTimeoutAction));
  });

  socket.addEventListener('error', function () {
    dispatch({
      type: 'ChangeConnectionState',
      state: {
        type: 'error',
        message: 'Browser could not establish a connection with the server',
      },
    });
  });

  socket.addEventListener('message', (message) => {
    const action: IncomingAction = JSON.parse(message.data);

    if (getState().connectionState.type === 'notInitialised') {
      // update the connectionState on receiving the first data points

      dispatch({
        type: 'ChangeConnectionState',
        state: {
          type: 'open',
        },
      });
    }

    switch (action.type) {
      case 'avgLoad':
        dispatch({
          type: 'AddDataPoint',
          data: action.data,
          timestamp: action.timestamp,
        });
    }
  });

  socket.addEventListener('close', () => {
    dispatch({
      type: 'ChangeConnectionState',
      state: {
        type: 'closed',
      },
    });
  });

  (window as any).increaseCpuLoad = () => {
    const action: OutgoingAction = {
      type: 'stress',
    };

    socket.send(JSON.stringify(action));
  };
};
