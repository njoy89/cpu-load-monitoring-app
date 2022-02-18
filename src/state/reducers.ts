import type { Action } from './actions';
import { State, DataPoint } from './state.type';

const T_1_MINUTE = 1000 * 60;

const getInitialState = (): State => ({
  dataPoints: {
    avg1m: [],
    avg5m: [],
    avg15m: [],
  },
});

export const rootReducer = (
  prevState: State | undefined = getInitialState(),
  action: Action
): State => {
  switch (action.type) {
    case 'AddDataPoint':
      const now = Date.now();

      const addDataPoint = (
        dataPoints: DataPoint[],
        t: number,
        v: number
      ): DataPoint[] =>
        dataPoints
          .filter((dataPoint) => now - dataPoint.t <= 2 * T_1_MINUTE)
          .concat({ t, v });

      return {
        ...prevState,
        dataPoints: {
          avg1m: addDataPoint(
            prevState.dataPoints.avg1m,
            action.timestamp,
            action.data.loadAvg1m
          ),
          avg5m: addDataPoint(
            prevState.dataPoints.avg5m,
            action.timestamp,
            action.data.loadAvg5m
          ),
          avg15m: addDataPoint(
            prevState.dataPoints.avg15m,
            action.timestamp,
            action.data.loadAvg15m
          ),
        },
      };
    default:
      return prevState;
  }
};
