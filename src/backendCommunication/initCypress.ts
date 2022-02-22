import { ThunkDispatch } from 'redux-thunk';

import { IncomingAction } from './actions';
import { State } from '../state/state.type';
import { Action } from '../state/actions';

export const initCypress = (
  dispatch: ThunkDispatch<State, undefined, Action>
) => {
  dispatch({
    type: 'ChangeConnectionState',
    state: {
      type: 'open',
    },
  });

  (window as any).Cypress.addDataPoint = (action: IncomingAction) => {
    dispatch({
      type: 'AddDataPoint',
      data: action.data,
      timestamp: action.timestamp,
    });
  };
};
