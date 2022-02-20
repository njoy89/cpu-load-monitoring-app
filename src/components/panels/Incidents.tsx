import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { GridOptions, ColDef, GridReadyEvent } from 'ag-grid-community';

import { TimeRangePicker } from '../utils/TimeRangePicker';
import { InfoIconWithTooltip } from '../utils/InfoIconWithTooltip';
import { ActionsMenu } from '../utils/ActionsMenu';
import { Panel, PanelBody, PanelHeader } from '../utils/Panel';

export const Incidents: React.FunctionComponent<{}> = () => {
  const [rowData] = useState([
    { no: 0, make: 'Toyota', model: 'Celica', price: 35000 },
    { no: 1, make: 'Ford', model: 'Mondeo', price: 32000 },
    { no: 2, make: 'Porsche', model: 'Boxter', price: 72000 },
  ]);

  const [columnDefs] = useState<ColDef[]>([
    { field: 'no', type: 'numericColumn' },
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
  ]);

  const gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    onGridReady({ api }: GridReadyEvent) {
      api.sizeColumnsToFit();
    },
  };

  return (
    <Panel>
      <PanelHeader>
        <div className="is-flex-grow-1">
          <span>Incidents </span>
          <InfoIconWithTooltip
            tooltip={`List the time periods when your CPU was under high average load with respect to 1m averages.`}
          />
        </div>
        <TimeRangePicker value="7d" />
        <ActionsMenu />
      </PanelHeader>
      <PanelBody>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            gridOptions={gridOptions}
          ></AgGridReact>
        </div>
      </PanelBody>
    </Panel>
  );
};
