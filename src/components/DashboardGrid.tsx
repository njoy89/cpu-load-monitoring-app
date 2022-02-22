import React from 'react';

import { CurrentCpuLoadPanel } from './panels/CurrentCpuLoadPanel';
import { CpuLoadWindowPanel } from './panels/CpuLoadWindowPanel';
import { Notification } from './utils/Notification';
import { Incidents } from './panels/Incidents';

function DashboardGrid() {
  return (
    <div className="container is-fluid is-desktop">
      <h1 className="title is-1 pt-5">CPU Load Monitoring</h1>
      <Notification />

      <div className="columns is-multiline">
        <div className="column is-4">
          <CurrentCpuLoadPanel avgType="avg1m" />
        </div>
        <div className="column is-4">
          <CurrentCpuLoadPanel avgType="avg5m" />
        </div>
        <div className="column is-4">
          <CurrentCpuLoadPanel avgType="avg15m" />
        </div>
        <div className="column is-full">
          <CpuLoadWindowPanel />
        </div>
        <div className="column is-8">
          <Incidents />
        </div>
      </div>
    </div>
  );
}

export default DashboardGrid;
