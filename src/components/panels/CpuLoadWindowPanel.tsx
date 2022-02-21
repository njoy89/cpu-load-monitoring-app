import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { renderToString } from 'react-dom/server';

import CanvasJSReact from '../../3rd_party/canvasjs.react.js';
import { DataPoint, State } from '../../state/state.type';
import {
  ELEVATED_LOAD_COLOR,
  HIGH_LOAD_COLOR,
  LOW_LOAD_COLOR,
  LOW_LOAD_THRESHOLD_BEGIN,
  LOW_LOAD_THRESHOLD_END,
  ELEVATED_LOAD_THRESHOLD_BEGIN,
  ELEVATED_LOAD_THRESHOLD_END,
  HIGH_LOAD_THRESHOLD_BEGIN,
  WINDOW_DURATION,
} from '../../constants';
import { TimeRangePicker } from './../utils/TimeRangePicker';
import { InfoIconWithTooltip } from '../utils/InfoIconWithTooltip';
import { ActionsMenu } from '../utils/ActionsMenu';
import { Panel, PanelBody, PanelHeader } from '../utils/Panel';
import { getNow } from '../../utils/getNow';

interface TooltipProps {
  dataPoint: CanvasJS.ChartDataPoint;
  dataSeries: CanvasJS.ChartDataSeriesOptions;
}

const Tooltip: React.FunctionComponent<TooltipProps> = ({
  dataPoint,
  dataSeries,
}) => {
  return (
    <div>
      <strong
        style={{
          color: dataSeries.color,
        }}
      >
        {dataSeries.name}
      </strong>
      <div>
        <strong>{dataPoint.y?.toFixed(2)} %</strong>
      </div>
      <div>{new Date(dataPoint.x!).toLocaleString()}</div>
    </div>
  );
};

const addDataSeries = ({
  dataPoints,
  name,
  visible,
}: {
  dataPoints: DataPoint[];
  name: string;
  visible: boolean;
}): CanvasJS.ChartDataSeriesOptions => ({
  type: 'line',
  xValueType: 'dateTime',
  markerSize: 5,
  name,
  dataPoints: dataPoints.map((d) => ({
    y: d.v,
    x: d.t,
  })),
  showInLegend: true,
  visible,
});

export const CpuLoadWindowPanel: React.FunctionComponent<{}> = () => {
  const dataPoints = useSelector((state: State) => state.dataPoints);
  const [selectedSeries, setSelectedSeries] = useState([
    '1m average',
    '5m average',
    '15m average',
  ]);
  const canvasJsOptions = useMemo(
    (): CanvasJS.ChartOptions => ({
      title: {},
      animationEnabled: true,
      theme: 'light2',
      axisY: {
        minimum: 0,
        // maximum: 100,
        labelFormatter: ({ value }: { value: number }) => `${value} %`,
        stripLines: [
          {
            startValue: LOW_LOAD_THRESHOLD_BEGIN,
            endValue: LOW_LOAD_THRESHOLD_END,
            color: LOW_LOAD_COLOR,
            labelWrap: false,
            labelMaxWidth: 50,
          },
          {
            startValue: ELEVATED_LOAD_THRESHOLD_BEGIN,
            endValue: ELEVATED_LOAD_THRESHOLD_END,
            color: ELEVATED_LOAD_COLOR,
            labelWrap: false,
            labelMaxWidth: 50,
          },
          {
            startValue: HIGH_LOAD_THRESHOLD_BEGIN,
            endValue: 1_000_000,
            color: HIGH_LOAD_COLOR,
            labelWrap: false,
            labelMaxWidth: 50,
          },
        ],
      },
      axisX: {
        valueFormatString: 'hh:mm:ss TT',
        minimum: getNow() - WINDOW_DURATION,
      },
      data: [
        addDataSeries({
          dataPoints: dataPoints.avg1m,
          name: '1m average',
          visible: selectedSeries.includes('1m average'),
        }),
        addDataSeries({
          dataPoints: dataPoints.avg5m,
          name: '5m average',
          visible: selectedSeries.includes('5m average'),
        }),
        addDataSeries({
          dataPoints: dataPoints.avg15m,
          name: '15m average',
          visible: selectedSeries.includes('15m average'),
        }),
      ],
      toolTip: {
        contentFormatter(e: {
          chart: CanvasJS.Chart;
          toolTip: CanvasJS.ChartToolTipOptions;
          entries: Array<{
            dataPoint: CanvasJS.ChartDataPoint;
            dataSeries: CanvasJS.ChartDataSeriesOptions;
          }>;
        }): string {
          return renderToString(
            <Tooltip
              dataPoint={e.entries[0].dataPoint}
              dataSeries={e.entries[0].dataSeries}
            />
          );
        },
      },
      legend: {
        horizontalAlign: 'center',
        verticalAlign: 'bottom',
        cursor: 'pointer',
        itemclick: (e) => {
          const seriesName = e.dataSeries.name;
          if (typeof seriesName === 'undefined') {
            return;
          }

          if (selectedSeries.includes(seriesName)) {
            setSelectedSeries(selectedSeries.filter((s) => s !== seriesName));
          } else {
            setSelectedSeries(selectedSeries.concat(seriesName));
          }
        },
      },
    }),
    [dataPoints, selectedSeries]
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
