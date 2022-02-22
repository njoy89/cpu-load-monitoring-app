import React from 'react';

import { Panel, PanelBody, PanelHeader } from '../utils/Panel';
import { ActionsMenu } from '../utils/ActionsMenu';

const wrapperStyles = {
  height: 400,
  overflowX: 'hidden',
  overflowY: 'scroll',
  width: '100%',
};

export const InstructionsTextPanel: React.FunctionComponent<{}> = () => (
  <Panel>
    <PanelHeader>
      <div className="is-flex-grow-1">
        <span>Text Panel with instructions</span>
      </div>
      <ActionsMenu />
    </PanelHeader>
    <PanelBody>
      <div style={wrapperStyles} className="content has-text-left">
        <p>
          To force your CPU to increase its usage, run{' '}
          <code>window.increaseCpuLoad()</code> in Developer Console, which runs{' '}
          <a
            href="https://www.unix.com/man-page/debian/1/STRESS/"
            target="_blank"
            rel="noreferrer"
          >
            <code>stress</code> command
          </a>{' '}
          on the server. Use it with caution!
        </p>
        <p>
          <h4>Single Value Panels</h4>
          Top three panels answer to the question:
          <pre>- What is my computer's current average CPU load?</pre>
          The ranges that influance the background color are defined as follows:
          <br />
          <span className="has-background-success-light">[0%, 60%]</span>,{' '}
          <span className="has-background-warning-light">(60%, 100%]</span> and{' '}
          <span className="has-background-danger-light">(100%, +&infin;)</span>.
        </p>
        <h4>Time Series Panel</h4>
        <p>
          The panel in the second row answers the question:{' '}
          <pre>
            - How did the average CPU load change over a 10 minute window?
          </pre>
          The chart has{' '}
          <a
            href="https://canvasjs.com/docs/charts/chart-options/axisy/strip-trend-lines/"
            target="_blank"
            rel="noreferrer"
          >
            strip lines
          </a>{' '}
          defined at the same thresholds as SVP panels. New data points show up
          every 10 seconds.
        </p>
        <h4>Data Table Panel</h4>
        <p>
          The panel in the last row lists down all <i>Incidents</i> and gives
          answers to the questions:
          <pre>
            - Has my computer been under heavy CPU load for 2 minutes or more?
            When? How many times? <br />- Has my computer recovered from heavy
            CPU load? When? How many times?
          </pre>
          An <i>Incident</i> can be thought of as a time range when CPU was
          fully under high average load for at least 2 minutes. If its right
          boundary is defined, it means that at least 2 consecutive minutes
          after it the CPU load was under 100% load (it recovered) — its status
          is <span className="has-text-success">resolved</span>. If the right
          boundary is undefined, it means the CPU is still under heavy load and
          its status is <span className="has-text-danger">ongoing</span>.
        </p>
      </div>
    </PanelBody>
  </Panel>
);
