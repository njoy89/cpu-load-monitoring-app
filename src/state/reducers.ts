import type { Action } from './actions';
import { State, DataPoint } from './state.type';
import { T_1_MINUTE } from '../constants';

const getInitialState = (): State => ({
  dataPoints: {
    avg1m: [],
    avg5m: [],
    avg15m: [],
  },
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
    .filter((dataPoint) => now - dataPoint.t <= 2 * T_1_MINUTE)
    .concat({ t, v: v * 100 });

export const rootReducer = (
  prevState: State | undefined = getInitialState(),
  action: Action
): State => {
  switch (action.type) {
    case 'AddDataPoint':
      const now = Date.now();

      return {
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
      };
    default:
      return prevState;
  }
};
