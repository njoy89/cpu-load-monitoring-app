import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ChartDataSeriesOptions, ChartOptions } from 'canvasjs';

import CanvasJSReact from '../../3rd_party/canvasjs.react.js';
import { DataPoint, State } from '../../state/state.type';
import { T_1_MINUTE } from '../../constants';
import { TimeRangePicker } from './../utils/TimeRangePicker';
import { InfoIconWithTooltip } from '../utils/InfoIconWithTooltip';
import { ActionsMenu } from '../utils/ActionsMenu';
import { Panel, PanelBody, PanelHeader } from '../utils/Panel';

const addDataSeries = ({
  dataPoints,
}: {
  dataPoints: DataPoint[];
}): ChartDataSeriesOptions => ({
  type: 'line',
  xValueType: 'dateTime',
  markerSize: 5,
  dataPoints: dataPoints.map((d) => ({
    y: d.v,
    x: d.t,
  })),
});

export const CpuLoadWindowPanel: React.FunctionComponent<{}> = () => {
  const dataPoints = useSelector((state: State) => state.dataPoints);
  const canvasJsOptions = useMemo(
    (): ChartOptions => ({
      title: {},
      animationEnabled: true,
      theme: 'light2',
      axisY: {
        minimum: 0,
        // maximum: 100,
        labelFormatter: ({ value }: { value: number }) => `${value} %`,
      },
      axisX: {
        valueFormatString: 'hh:mm:ss TT',
        minimum: Date.now() - 2 * T_1_MINUTE,
      },
      data: [
        addDataSeries({ dataPoints: dataPoints.avg1m }),
        addDataSeries({ dataPoints: dataPoints.avg5m }),
        addDataSeries({ dataPoints: dataPoints.avg15m }),
      ],
    }),
    [dataPoints]
  );

  return (
    <Panel>
      <PanelHeader>
        <div className="is-flex-grow-1">
          <span>The average CPU load change over a 10 minute window </span>
          <InfoIconWithTooltip tooltip="The panel displays the current CPU Load based on  average data." />
        </div>
        <TimeRangePicker value="10m" />
        <ActionsMenu />
      </PanelHeader>
      <PanelBody>
        <CanvasJSReact.CanvasJSChart options={canvasJsOptions} />
      </PanelBody>
    </Panel>
  );
};
