import React from 'react';
import { useSelector } from 'react-redux';

import type { State } from '../../state/state.type';
import { TimeRangePicker } from '../utils/TimeRangePicker';
import { InfoIconWithTooltip } from '../utils/InfoIconWithTooltip';
import { ActionsMenu } from '../utils/ActionsMenu';
import { Panel, PanelBody, PanelHeader } from '../utils/Panel';
import {
  ELEVATED_LOAD_THRESHOLD_BEGIN,
  LOW_LOAD_THRESHOLD_BEGIN,
  LOW_LOAD_THRESHOLD_END,
  ELEVATED_LOAD_THRESHOLD_END,
} from '../../constants';

const getLast = <T extends any>(arr: T[]): T | undefined =>
  arr.length > 0 ? arr[arr.length - 1] : undefined;

interface CurrentCpuLoadPanelProps {
  avgType: keyof State['dataPoints'];
}

const getBackgroundClass = (v: number | undefined): string => {
  if (typeof v === 'undefined') {
    return '';
  } else if (v >= LOW_LOAD_THRESHOLD_BEGIN && v <= LOW_LOAD_THRESHOLD_END) {
    return 'has-background-success-light';
  } else if (
    v > ELEVATED_LOAD_THRESHOLD_BEGIN &&
    v <= ELEVATED_LOAD_THRESHOLD_END
  ) {
    return 'has-background-warning-light';
  } else {
    return 'has-background-danger-light';
  }
};

export const CurrentCpuLoadPanel: React.FunctionComponent<
  CurrentCpuLoadPanelProps
> = ({ avgType }) => {
  const lastDataPointValue = useSelector((state: State) => {
    const lastDataPoint = getLast(state.dataPoints[avgType]);
    return lastDataPoint?.v;
  });
  const formattedValue =
    typeof lastDataPointValue === 'undefined'
      ? 'N/A'
      : lastDataPointValue.toFixed(2);
  const timeRange = avgType.substr(3);
  const backgroundClass = getBackgroundClass(lastDataPointValue);

  return (
    <Panel>
      <PanelHeader>
        <div className="is-flex-grow-1">
          <span>Current CPU Load </span>
          <InfoIconWithTooltip
            tooltip={`The panel displays the current CPU Load based on ${timeRange} average data.`}
          />
        </div>
        <TimeRangePicker value={timeRange} />
        <ActionsMenu />
      </PanelHeader>
      <PanelBody
        className={backgroundClass}
        dataTest={`current-cpu-load-${timeRange}`}
      >
        <div className="is-size-1">{formattedValue}</div>
        <div className="is-size-3 m-2"> %</div>
      </PanelBody>
    </Panel>
  );
};
