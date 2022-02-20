import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useSelector } from 'react-redux';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import type { GridOptions, ColDef, GridReadyEvent } from 'ag-grid-community';

import { TimeRangePicker } from '../utils/TimeRangePicker';
import { InfoIconWithTooltip } from '../utils/InfoIconWithTooltip';
import { ActionsMenu } from '../utils/ActionsMenu';
import { Panel, PanelBody, PanelHeader } from '../utils/Panel';
import type { State } from '../../state/state.type';

interface IncidentRow {
  no: number;
  startedAt: number;
  endedAt?: number;
  duration?: number;
  status: 'ongoing' | 'resolved';
}

const formatDate = (timestamp: number): string =>
  format(new Date(timestamp), 'yyyy/MM/dd HH:mm:ss.SSS a');

const DASH = '—';

export const Incidents: React.FunctionComponent<{}> = () => {
  const incidents = useSelector((state: State) => state.incidents);

  const incidentRows = useMemo(
    (): IncidentRow[] =>
      incidents.map((incident, index): IncidentRow => {
        return {
          no: index + 1,
          startedAt: incident.startedAt,
          endedAt: incident.endedAt,
          duration:
            incident.endedAt === undefined
              ? undefined
              : incident.endedAt - incident.startedAt,
          status: incident.endedAt === undefined ? 'ongoing' : 'resolved',
        };
      }),
    [incidents]
  );

  const columnDefs = useMemo(
    (): ColDef[] => [
      { field: 'no', type: 'numericColumn', maxWidth: 100 },
      {
        field: 'startedAt',
        valueFormatter: ({ value }: { value: IncidentRow['startedAt'] }) =>
          formatDate(value),
        sort: 'desc',
      },
      {
        field: 'endedAt',
        valueFormatter: ({ value }: { value: IncidentRow['endedAt'] }) =>
          value === undefined ? DASH : formatDate(value),
      },
      {
        field: 'duration',
        valueFormatter: (params) => {
          const row = params.data as IncidentRow;

          if (row.endedAt === undefined) {
            return DASH;
          }

          const interval = intervalToDuration({
            start: new Date(row.startedAt),
            end: new Date(row.endedAt),
          });

          return formatDuration(interval);
        },
      },
      {
        field: 'status',
        cellRenderer: ({ value }: { value: IncidentRow['status'] }) => {
          return (
            <span
              className={
                value === 'ongoing' ? 'has-text-danger' : 'has-text-success'
              }
            >
              {value}
            </span>
          );
        },
      },
    ],
    []
  );

  const emptyList = incidentRows.length === 0;
  const gridOptions = useMemo(
    (): GridOptions => ({
      pagination: !emptyList,
      paginationPageSize: 10,
      defaultColDef: {
        resizable: true,
        sortable: true,
      },
      onGridReady({ api }: GridReadyEvent) {
        api.sizeColumnsToFit();
      },
      overlayNoRowsTemplate: '<span>No incident has been reported</span>',
    }),
    [emptyList]
  );

  return (
    <Panel>
      <PanelHeader>
        <div className="is-flex-grow-1">
          <span>Incidents </span>
          <InfoIconWithTooltip
            tooltip={`List down the time periods when your CPU was under high average load with respect to 1m averages.`}
          />
        </div>
        <TimeRangePicker value="7d" />
        <ActionsMenu />
      </PanelHeader>
      <PanelBody>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={incidentRows}
            columnDefs={columnDefs}
            gridOptions={gridOptions}
          ></AgGridReact>
        </div>
      </PanelBody>
    </Panel>
  );
};
