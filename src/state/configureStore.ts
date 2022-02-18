import { createStore, Store, applyMiddleware } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import { rootReducer } from './reducers';
import type { Action } from './actions';
import type { State } from './state.type';

export const configureStore = (): Store<State, Action> & {
  dispatch: ThunkDispatch<State, undefined, Action>;
} => createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
