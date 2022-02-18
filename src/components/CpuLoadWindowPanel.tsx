import React from 'react';
import CanvasJSReact from '../3rd_party/canvasjs.react.js';
import { State } from '../state/state.type';
import { useSelector } from 'react-redux';

export const CpuLoadWindowPanel: React.FunctionComponent<{}> = () => {
  const dataPoints = useSelector((state: State) => state.dataPoints);

  return (
    <article className="panel is-primary">
      <p className="panel-heading is-flex is-align-items-center p-2">
        <div className="is-flex-grow-1">
          <span>The average CPU load change over a 10 minute window </span>
          <span
            className="has-tooltip-multiline has-text-centered"
            data-tooltip={`The panel displays the current CPU Load based on  average data.`}
          >
            <i className="fa-solid fa-circle-question"></i>
          </span>
        </div>
        <span
          className="tag is-info is-medium is-light"
          data-tooltip="Time range picker TODO"
        >
          10m
        </span>
        <span
          className="has-tooltip-multiline has-text-centered ml-2"
          data-tooltip={`Options menu TODO`}
        >
          <i className="fa-solid fa-gear"></i>
        </span>
      </p>
      <div className="panel-block has-text-centered p-4 has-background-white is-justify-content-center">
        <CanvasJSReact.CanvasJSChart
          options={{
            animationEnabled: true,
            theme: 'light2',
            axisY: {
              includeZero: false,
            },
            axisX: {
              valueFormatString: 'hh:mm:ss',
            },
            data: [
              {
                type: 'line',
                xValueType: 'dateTime',
                dataPoints: dataPoints.avg1m
                  .map((d) => ({
                    y: d.v,
                    x: d.t,
                  }))
                  .concat({
                    y: NaN,
                    x: Date.now() - 1000 * 60 * 2,
                  }),
              },
              {
                type: 'line',
                xValueType: 'dateTime',
                dataPoints: dataPoints.avg5m.map((d) => ({
                  y: d.v,
                  x: d.t,
                })),
              },
              {
                type: 'line',
                xValueType: 'dateTime',
                dataPoints: dataPoints.avg15m.map((d) => ({
                  y: d.v,
                  x: d.t,
                })),
              },
            ],
          }}
        />
      </div>
    </article>
  );
};
