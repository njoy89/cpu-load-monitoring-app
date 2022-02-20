export interface DataPoint {
  t: number;
  v: number;
}

interface CpuLoadStateCalm {
  type: 'CpuLoadStateCalm';
}

interface CpuLoadStateIncreasingLoad {
  type: 'CpuLoadStateIncreasingLoad';
  firstDataPoint: DataPoint;
}

interface CpuLoadStateHighCpuLoad {
  type: 'CpuLoadStateHighCpuLoad';
}

interface CpuLoadStateRecovering {
  type: 'CpuLoadStateRecovering';
  firstDataPoint: DataPoint;
}

export type CpuLoadState =
  | CpuLoadStateCalm
  | CpuLoadStateIncreasingLoad
  | CpuLoadStateHighCpuLoad
  | CpuLoadStateRecovering;

export interface Incident {
  startedAt: number;
  endedAt?: number;
}

export interface State {
  dataPoints: {
    avg1m: DataPoint[];
    avg5m: DataPoint[];
    avg15m: DataPoint[];
  };
  cpuLoadState: CpuLoadState;
  incidents: Incident[];
}
