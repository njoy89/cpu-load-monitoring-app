export interface AddDataPoint {
  type: 'AddDataPoint';
  data: {
    loadAvg1m: number;
    loadAvg5m: number;
    loadAvg15m: number;
  };
  timestamp: number;
}

export type Action = AddDataPoint;
