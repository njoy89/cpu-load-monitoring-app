export interface DataPoint {
  t: number;
  v: number;
}

export interface State {
  dataPoints: {
    avg1m: DataPoint[];
    avg5m: DataPoint[];
    avg15m: DataPoint[];
  };
}
