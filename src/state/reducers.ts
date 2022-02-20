import type { Action } from './actions';
import type { State, DataPoint, CpuLoadState } from './state.type';
import {
  HIGH_LOAD_THRESHOLD_BEGIN,
  MIN_DURATION_TO_ALERT,
  WINDOW_DURATION,
} from '../constants';

const getInitialState = (): State => ({
  dataPoints: {
    avg1m: [],
    avg5m: [],
    avg15m: [],
  },
  cpuLoadState: {
    type: 'CpuLoadStateCalm',
  },
  incidents: [],
});

const addDataPoint = ({
  dataPoints,
  t,
  v,
  now,
}: {
  dataPoints: DataPoint[];
  t: number;
  v: number;
  now: number;
}): DataPoint[] =>
  dataPoints
    .filter((dataPoint) => now - dataPoint.t <= WINDOW_DURATION)
    .concat({ t, v: v * 100 });

export const updateCpuLoadState = ({
  prevState,
  latestDataPoint,
}: {
  prevState: CpuLoadState;
  latestDataPoint: DataPoint;
}): CpuLoadState => {
  switch (prevState.type) {
    case 'CpuLoadStateCalm':
      return latestDataPoint.v > HIGH_LOAD_THRESHOLD_BEGIN
        ? {
            type: 'CpuLoadStateIncreasingLoad',
            firstDataPoint: latestDataPoint,
          }
        : prevState;
    case 'CpuLoadStateIncreasingLoad':
      if (latestDataPoint.v <= HIGH_LOAD_THRESHOLD_BEGIN) {
        return {
          type: 'CpuLoadStateCalm',
        };
      }
      return latestDataPoint.t - prevState.firstDataPoint.t >=
        MIN_DURATION_TO_ALERT
        ? {
            type: 'CpuLoadStateHighCpuLoad',
          }
        : prevState;
    case 'CpuLoadStateHighCpuLoad':
      return latestDataPoint.v > HIGH_LOAD_THRESHOLD_BEGIN
        ? prevState
        : {
            type: 'CpuLoadStateRecovering',
            firstDataPoint: latestDataPoint,
          };
    case 'CpuLoadStateRecovering':
      if (latestDataPoint.v > HIGH_LOAD_THRESHOLD_BEGIN) {
        return {
          type: 'CpuLoadStateHighCpuLoad',
        };
      }
      return latestDataPoint.t - prevState.firstDataPoint.t >=
        MIN_DURATION_TO_ALERT
        ? {
            type: 'CpuLoadStateCalm',
          }
        : prevState;
  }
};

export const rootReducer = (
  prevState: State | undefined = getInitialState(),
  action: Action
): State => {
  switch (action.type) {
    case 'AddDataPoint':
      const now = Date.now();

      const newState: State = {
        ...prevState,
        dataPoints: {
          avg1m: addDataPoint({
            dataPoints: prevState.dataPoints.avg1m,
            t: action.timestamp,
            v: action.data.loadAvg1m,
            now,
          }),
          avg5m: addDataPoint({
            dataPoints: prevState.dataPoints.avg5m,
            t: action.timestamp,
            v: action.data.loadAvg5m,
            now,
          }),
          avg15m: addDataPoint({
            dataPoints: prevState.dataPoints.avg15m,
            t: action.timestamp,
            v: action.data.loadAvg15m,
            now,
          }),
        },
        cpuLoadState: updateCpuLoadState({
          prevState: prevState.cpuLoadState,
          latestDataPoint: {
            t: action.timestamp,
            v: action.data.loadAvg1m * 100,
          },
        }),
      };

      if (
        prevState?.cpuLoadState.type === 'CpuLoadStateIncreasingLoad' &&
        newState.cpuLoadState.type === 'CpuLoadStateHighCpuLoad'
      ) {
        newState.incidents = newState.incidents.concat({
          startedAt: prevState.cpuLoadState.firstDataPoint.t,
          endedAt: undefined,
        });
      }

      if (
        prevState?.cpuLoadState.type === 'CpuLoadStateRecovering' &&
        newState.cpuLoadState.type === 'CpuLoadStateCalm'
      ) {
        const lastIncident = newState.incidents.pop();

        if (lastIncident === undefined) {
          throw new Error('There should be at least one incident!');
        }

        newState.incidents = newState.incidents.concat({
          startedAt: lastIncident.startedAt,
          endedAt: prevState.cpuLoadState.firstDataPoint.t,
        });
      }

      return newState;
    default:
      return prevState;
  }
};
