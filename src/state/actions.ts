import { ConnectionState } from './state.type';

export interface AddDataPoint {
  type: 'AddDataPoint';
  data: {
    loadAvg1m: number;
    loadAvg5m: number;
    loadAvg15m: number;
  };
  timestamp: number;
}

interface ChangeConnectionState {
  type: 'ChangeConnectionState';
  state: ConnectionState;
}

export type Action = AddDataPoint | ChangeConnectionState;
