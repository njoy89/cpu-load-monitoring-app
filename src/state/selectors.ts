import { State } from './state.type';

const getLast = <T>(arr: T[]): T | undefined =>
  arr.length > 0 ? arr[arr.length - 1] : undefined;

export const getCurrentAvgs = (
  state: State
): [number, number, number] | undefined => {
  const last1m = getLast(state.dataPoints.avg1m);
  const last5m = getLast(state.dataPoints.avg5m);
  const last15m = getLast(state.dataPoints.avg15m);

  return last1m && last5m && last15m
    ? [last1m.v, last5m.v, last15m.v]
    : undefined;
};
