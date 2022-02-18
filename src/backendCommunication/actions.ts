export type OutgoingAction = {
  type: 'init';
  timeout: number;
};

export type IncomingAction = {
  type: 'avgLoad';
  data: {
    loadAvg1m: number;
    loadAvg5m: number;
    loadAvg15m: number;
  };
  timestamp: number;
};
