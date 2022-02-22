import type { ActionCreator } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import { FETCH_TIMEOUT, WS_ADDRESS } from '../constants';
import type { State } from './../state/state.type';
import type { Action } from './../state/actions';
import type { IncomingAction, OutgoingAction } from './actions';
import { initCypress } from './initCypress';

export const initCommunication: ActionCreator<
  ThunkAction<void, State, undefined, Action>
> = () => (dispatch) => {
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

  socket.addEventListener('message', (message) => {
    const action: IncomingAction = JSON.parse(message.data);

    switch (action.type) {
      case 'avgLoad':
        dispatch({
          type: 'AddDataPoint',
          data: action.data,
          timestamp: action.timestamp,
        });
    }
  });

  (window as any).increaseCpuLoad = () => {
    const action: OutgoingAction = {
      type: 'stress',
    };

    socket.send(JSON.stringify(action));
  };
};
