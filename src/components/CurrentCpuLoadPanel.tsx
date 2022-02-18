import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../state/state.type';

const getLast = <T extends any>(arr: T[]): T | undefined =>
  arr.length > 0 ? arr[arr.length - 1] : undefined;

interface CurrentCpuLoadPanelProps {
  avgType: keyof State['dataPoints'];
}

export const CurrentCpuLoadPanel: React.FunctionComponent<
  CurrentCpuLoadPanelProps
> = ({ avgType }) => {
  const value = useSelector((state: State) => {
    const lastDataPoint = getLast(state.dataPoints[avgType]);
    return typeof lastDataPoint === 'undefined'
      ? 'N/A'
      : (lastDataPoint.v * 100).toFixed(2);
  });
  const timeRange = avgType.substr(3);

  return (
    <article className="panel is-primary">
      <p className="panel-heading is-flex is-align-items-center p-2">
        <div className="is-flex-grow-1">
          <span>Current CPU Load </span>
          <span
            className="has-tooltip-multiline has-text-centered"
            data-tooltip={`The panel displays the current CPU Load based on ${timeRange} average data.`}
          >
            <i className="fa-solid fa-circle-question"></i>
          </span>
        </div>
        <span
          className="tag is-info is-medium is-light"
          data-tooltip="Time range picker TODO"
        >
          {timeRange}
        </span>
        <span
          className="has-tooltip-multiline has-text-centered ml-2"
          data-tooltip={`Options menu TODO`}
        >
          <i className="fa-solid fa-gear"></i>
        </span>
      </p>
      <div className="panel-block has-text-centered p-4 has-background-white is-justify-content-center">
        <div className="is-size-1">{value}</div>
        <div className="is-size-3 m-2"> %</div>
      </div>
    </article>
  );
};
