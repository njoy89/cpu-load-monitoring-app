import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../state/state.type';
import { TimeRangePicker } from '../utils/TimeRangePicker';
import { InfoIconWithTooltip } from '../utils/InfoIconWithTooltip';
import { ActionsMenu } from '../utils/ActionsMenu';

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
      : lastDataPoint.v.toFixed(2);
  });
  const timeRange = avgType.substr(3);

  return (
    <article className="panel is-primary">
      <p className="panel-heading is-flex is-align-items-center p-2">
        <div className="is-flex-grow-1">
          <span>Current CPU Load </span>
          <InfoIconWithTooltip
            tooltip={`The panel displays the current CPU Load based on ${timeRange} average data.`}
          />
        </div>
        <TimeRangePicker value={timeRange} />
        <ActionsMenu />
      </p>
      <div className="panel-block has-text-centered p-4 has-background-white is-justify-content-center">
        <div className="is-size-1">{value}</div>
        <div className="is-size-3 m-2"> %</div>
      </div>
    </article>
  );
};
