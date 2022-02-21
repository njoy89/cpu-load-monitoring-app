import { rootReducer, updateCpuLoadState, updateIncidents } from './reducers';
import type { CpuLoadState, DataPoint, Incident } from './state.type';
import {
  HIGH_LOAD_THRESHOLD_BEGIN,
  MIN_DURATION_TO_ALERT,
  WINDOW_DURATION,
} from '../constants';
import { State } from './state.type';

const NOW = 1645459573721;

jest.mock('../utils/getNow', () => ({
  getNow: () => NOW,
}));

describe('updateCpuLoadState - State Machine', () => {
  it('Calm -> Calm', () => {
    const prevState: CpuLoadState = {
      type: 'CpuLoadStateCalm',
    };
    expect(
      updateCpuLoadState({
        prevState,
        latestDataPoint: {
          t: NOW,
          v: 42,
        },
      })
    ).toEqual(prevState);
    expect(
      updateCpuLoadState({
        prevState,
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN,
        },
      })
    ).toEqual(prevState);
  });

  it('Calm -> IncreasedLoad', () => {
    const dataPoint: DataPoint = {
      t: NOW,
      v: HIGH_LOAD_THRESHOLD_BEGIN + 2,
    };
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateIncreasingLoad',
      firstDataPoint: dataPoint,
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateCalm',
        },
        latestDataPoint: dataPoint,
      })
    ).toEqual(expectedState);
  });

  it('IncreasedLoad -> IncreasedLoad', () => {
    const prevState: CpuLoadState = {
      type: 'CpuLoadStateIncreasingLoad',
      firstDataPoint: {
        t: NOW - 1000,
        v: HIGH_LOAD_THRESHOLD_BEGIN + 2,
      },
    };
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateIncreasingLoad',
      firstDataPoint: prevState.firstDataPoint,
    };
    expect(
      updateCpuLoadState({
        prevState,
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN + 1,
        },
      })
    ).toEqual(expectedState);
  });

  it('IncreasedLoad -> IncreasedLoad (time difference is _almost_ reaching threshold)', () => {
    const prevState: CpuLoadState = {
      type: 'CpuLoadStateIncreasingLoad',
      firstDataPoint: {
        t: NOW - MIN_DURATION_TO_ALERT + 1,
        v: HIGH_LOAD_THRESHOLD_BEGIN + 2,
      },
    };
    expect(
      updateCpuLoadState({
        prevState,
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN + 1,
        },
      })
    ).toEqual(prevState);
  });

  it('IncreasedLoad -> Calm', () => {
    const prevState: CpuLoadState = {
      type: 'CpuLoadStateIncreasingLoad',
      firstDataPoint: {
        t: NOW - 1000,
        v: HIGH_LOAD_THRESHOLD_BEGIN + 2,
      },
    };
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateCalm',
    };
    expect(
      updateCpuLoadState({
        prevState,
        latestDataPoint: {
          t: NOW,
          v: 10,
        },
      })
    ).toEqual(expectedState);
    expect(
      updateCpuLoadState({
        prevState,
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN,
        },
      })
    ).toEqual(expectedState);
  });

  it('IncreasedLoad -> HighLoad', () => {
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateHighCpuLoad',
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateIncreasingLoad',
          firstDataPoint: {
            t: NOW - MIN_DURATION_TO_ALERT,
            v: HIGH_LOAD_THRESHOLD_BEGIN + 2,
          },
        },
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN + 1,
        },
      })
    ).toEqual(expectedState);
  });

  it('HighLoad -> HighLoad', () => {
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateHighCpuLoad',
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateHighCpuLoad',
        },
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN + 1,
        },
      })
    ).toEqual(expectedState);
  });

  it('HighLoad -> Recovering', () => {
    const dataPoint: DataPoint = {
      t: NOW,
      v: HIGH_LOAD_THRESHOLD_BEGIN,
    };
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateRecovering',
      firstDataPoint: dataPoint,
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateHighCpuLoad',
        },
        latestDataPoint: dataPoint,
      })
    ).toEqual(expectedState);
  });

  it('Recovering -> Recovering', () => {
    const firstDataPoint: DataPoint = {
      t: NOW - 1000,
      v: HIGH_LOAD_THRESHOLD_BEGIN,
    };
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateRecovering',
      firstDataPoint,
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateRecovering',
          firstDataPoint,
        },
        latestDataPoint: {
          t: NOW - MIN_DURATION_TO_ALERT + 1,
          v: HIGH_LOAD_THRESHOLD_BEGIN,
        },
      })
    ).toEqual(expectedState);
  });

  it('Recovering -> HighLoad', () => {
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateHighCpuLoad',
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateRecovering',
          firstDataPoint: {
            t: NOW - 1000,
            v: HIGH_LOAD_THRESHOLD_BEGIN - 10,
          },
        },
        latestDataPoint: {
          t: NOW,
          v: HIGH_LOAD_THRESHOLD_BEGIN + 1,
        },
      })
    ).toEqual(expectedState);
  });

  it('Recovering -> Calm', () => {
    const expectedState: CpuLoadState = {
      type: 'CpuLoadStateCalm',
    };
    expect(
      updateCpuLoadState({
        prevState: {
          type: 'CpuLoadStateRecovering',
          firstDataPoint: {
            t: NOW - MIN_DURATION_TO_ALERT,
            v: HIGH_LOAD_THRESHOLD_BEGIN - 10,
          },
        },
        latestDataPoint: {
          t: NOW,
          v: 10,
        },
      })
    ).toEqual(expectedState);
  });
});

describe('update Incidents', () => {
  it('IncreasingLoad -> HighLoad', () => {
    const expectedResult: Incident[] = [
      {
        startedAt: NOW - 10 * 1000,
        endedAt: NOW - 5 * 1000,
      },
      {
        startedAt: NOW - MIN_DURATION_TO_ALERT - 10,
        endedAt: undefined,
      },
    ];
    expect(
      updateIncidents({
        prevState: {
          dataPoints: {
            avg1m: [],
            avg5m: [],
            avg15m: [],
          },
          cpuLoadState: {
            type: 'CpuLoadStateIncreasingLoad',
            firstDataPoint: {
              t: NOW - MIN_DURATION_TO_ALERT - 10,
              v: 102,
            },
          },
          incidents: [
            {
              startedAt: NOW - 10 * 1000,
              endedAt: NOW - 5 * 1000,
            },
          ],
        },
        newCpuLoadState: {
          type: 'CpuLoadStateHighCpuLoad',
        },
      })
    ).toEqual(expectedResult);
  });

  it('Recovering -> Calm', () => {
    const expectedResult: Incident[] = [
      {
        startedAt: NOW - 10 * 1000,
        endedAt: NOW - 5 * 1000,
      },
      {
        startedAt: NOW - MIN_DURATION_TO_ALERT - 2000,
        endedAt: NOW - MIN_DURATION_TO_ALERT - 10,
      },
    ];
    expect(
      updateIncidents({
        prevState: {
          dataPoints: {
            avg1m: [],
            avg5m: [],
            avg15m: [],
          },
          cpuLoadState: {
            type: 'CpuLoadStateRecovering',
            firstDataPoint: {
              t: NOW - MIN_DURATION_TO_ALERT - 10,
              v: 90,
            },
          },
          incidents: [
            {
              startedAt: NOW - 10 * 1000,
              endedAt: NOW - 5 * 1000,
            },
            {
              startedAt: NOW - MIN_DURATION_TO_ALERT - 2 * 1000,
              endedAt: undefined,
            },
          ],
        },
        newCpuLoadState: {
          type: 'CpuLoadStateCalm',
        },
      })
    ).toEqual(expectedResult);
  });
});

describe('rootReducer', () => {
  it('handles AddDataPoint action', () => {
    const expectedState: State = {
      dataPoints: {
        avg1m: [
          {
            t: NOW - 1000,
            v: 30,
          },
          {
            t: NOW,
            v: 102,
          },
        ],
        avg5m: [
          {
            t: NOW - 1000,
            v: 29,
          },
          {
            t: NOW,
            v: 101,
          },
        ],
        avg15m: [
          {
            t: NOW - WINDOW_DURATION,
            v: 22,
          },
          {
            t: NOW - 1000,
            v: 28,
          },
          {
            t: NOW,
            v: 100,
          },
        ],
      },
      cpuLoadState: {
        type: 'CpuLoadStateIncreasingLoad',
        firstDataPoint: {
          t: NOW,
          v: 102,
        },
      },
      incidents: [],
    };

    expect(
      rootReducer(
        {
          dataPoints: {
            avg1m: [
              {
                t: NOW - WINDOW_DURATION - 10,
                v: 20,
              },
              {
                t: NOW - 1000,
                v: 30,
              },
            ],
            avg5m: [
              {
                t: NOW - WINDOW_DURATION - 1,
                v: 21,
              },
              {
                t: NOW - 1000,
                v: 29,
              },
            ],
            avg15m: [
              {
                t: NOW - WINDOW_DURATION,
                v: 22,
              },
              {
                t: NOW - 1000,
                v: 28,
              },
            ],
          },
          cpuLoadState: {
            type: 'CpuLoadStateCalm',
          },
          incidents: [],
        },
        {
          type: 'AddDataPoint',
          timestamp: NOW,
          data: {
            loadAvg1m: 1.02,
            loadAvg5m: 1.01,
            loadAvg15m: 1,
          },
        }
      )
    ).toEqual(expectedState);
  });
});
