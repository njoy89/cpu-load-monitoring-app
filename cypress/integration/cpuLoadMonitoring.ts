/// <reference types="cypress" />

import { T_1_MINUTE } from '../../src/constants';
import { formatDate } from '../../src/utils/formatDate';
import { IncomingAction } from '../../src/backendCommunication/actions';

interface LatestDataPointsData {
  value: string;
  class:
    | 'has-background-success-light'
    | 'has-background-danger-light'
    | 'has-background-warning-light';
}

interface ValidateLatestDataPointsProps {
  loadAvg1m: LatestDataPointsData;
  loadAvg5m: LatestDataPointsData;
  loadAvg15m: LatestDataPointsData;
}

const CurrentCpuLoadPO = {
  avg1m: '[data-test="current-cpu-load-1m"]',
  avg5m: '[data-test="current-cpu-load-5m"]',
  avg15m: '[data-test="current-cpu-load-15m"]',
  validate(expected: ValidateLatestDataPointsProps) {
    cy.get(this.avg1m)
      .should('have.text', expected.loadAvg1m.value)
      .should('have.class', expected.loadAvg1m.class);
    cy.get(this.avg5m)
      .should('have.text', expected.loadAvg5m.value)
      .should('have.class', expected.loadAvg5m.class);
    cy.get(this.avg15m)
      .should('have.text', expected.loadAvg15m.value)
      .should('have.class', expected.loadAvg15m.class);
  },
};

const NotificationPO = {
  top: '[data-test="top-notification"].notification',
  toast: '#toast-wrapper .notification',
  validateTop(expected: string) {
    cy.get(this.top).should('contain.text', expected);
  },
  validateToast(expected: string) {
    cy.get(this.toast).should('have.text', expected);
  },
  expectTopHidden() {
    cy.get(this.top).should('not.exist');
  },
};

const IncidentsPO = {
  table: '#incidents-table',
  validate(expectedPaginatedTableData: any) {
    cy.get(IncidentsPO.table).agGridValidatePaginatedTable(
      expectedPaginatedTableData,
      {}
    );
  },
};

const addDataPoint = (
  window: Window & typeof globalThis,
  action: Omit<IncomingAction, 'type'>
) => {
  (window as any).Cypress.addDataPoint(action);
};

describe('Adding data point', () => {
  const TIMESTAMP = Date.now();

  before(() => {
    cy.visit('/');
  });

  it('updates CurrentCpuLoad panels and displays low CPU usage level', () => {
    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP - 10 * T_1_MINUTE,
          data: { loadAvg1m: 0.2, loadAvg5m: 0.2145, loadAvg15m: 0.2297 },
        });
      })
      .then(() => {
        CurrentCpuLoadPO.validate({
          loadAvg1m: {
            value: '20.00 %',
            class: 'has-background-success-light',
          },
          loadAvg5m: {
            value: '21.45 %',
            class: 'has-background-success-light',
          },
          loadAvg15m: {
            value: '22.97 %',
            class: 'has-background-success-light',
          },
        });
      });
  });

  it('updates CurrentCpuLoad panels and displays medium CPU usage level', () => {
    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP - 8 * T_1_MINUTE,
          data: { loadAvg1m: 0.642, loadAvg5m: 0.61242, loadAvg15m: 0.60356 },
        });
      })
      .then(() => {
        CurrentCpuLoadPO.validate({
          loadAvg1m: {
            value: '64.20 %',
            class: 'has-background-warning-light',
          },
          loadAvg5m: {
            value: '61.24 %',
            class: 'has-background-warning-light',
          },
          loadAvg15m: {
            value: '60.36 %',
            class: 'has-background-warning-light',
          },
        });
      });
  });

  it('updates CurrentCpuLoad panels and displays high CPU usage level', () => {
    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP - 7 * T_1_MINUTE,
          data: { loadAvg1m: 1.23, loadAvg5m: 1.01, loadAvg15m: 1.005 },
        });
      })
      .then(() => {
        CurrentCpuLoadPO.validate({
          loadAvg1m: {
            value: '123.00 %',
            class: 'has-background-danger-light',
          },
          loadAvg5m: {
            value: '101.00 %',
            class: 'has-background-danger-light',
          },
          loadAvg15m: {
            value: '100.50 %',
            class: 'has-background-danger-light',
          },
        });
      });
  });

  it('expects notification about high average CPU load', () => {
    cy.clock(TIMESTAMP);

    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP - 5 * T_1_MINUTE,
          data: { loadAvg1m: 1.43, loadAvg5m: 1.11, loadAvg15m: 1.035 },
        });
      })
      .then(() => {
        NotificationPO.validateTop('Your CPU is under high average load!');
        NotificationPO.validateToast(
          'Your CPU has just went under high average load!'
        );

        cy.tick(T_1_MINUTE);
      });
  });

  it('expects a new incident on the table', () => {
    IncidentsPO.validate([
      [
        {
          No: '1',
          Description: 'high average CPU load',
          'Started At': formatDate(TIMESTAMP - 7 * T_1_MINUTE),
          'Ended At': '—',
          Duration: '—',
          Status: 'ongoing',
        },
      ],
    ]);
  });

  it('CPU recovered', () => {
    cy.clock(TIMESTAMP);

    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP - 4 * T_1_MINUTE,
          data: { loadAvg1m: 0.91, loadAvg5m: 0.93, loadAvg15m: 0.94 },
        });

        addDataPoint(window, {
          timestamp: TIMESTAMP - 2 * T_1_MINUTE,
          data: { loadAvg1m: 0.9, loadAvg5m: 0.91, loadAvg15m: 0.92 },
        });
      })
      .then(() => {
        NotificationPO.expectTopHidden();
        NotificationPO.validateToast(
          'Your CPU has just recovered from high average load!'
        );

        cy.tick(T_1_MINUTE);
      });
  });

  it('expects the incident row is updated', () => {
    IncidentsPO.validate([
      [
        {
          No: '1',
          Description: 'high average CPU load',
          'Started At': formatDate(TIMESTAMP - 7 * T_1_MINUTE),
          'Ended At': formatDate(TIMESTAMP - 4 * T_1_MINUTE),
          Duration: '3 minutes',
          Status: 'resolved',
        },
      ],
    ]);
  });

  it('CPU high load again', () => {
    cy.clock(TIMESTAMP);

    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP - 1.5 * T_1_MINUTE,
          data: { loadAvg1m: 1.11, loadAvg5m: 1.01, loadAvg15m: 1.0 },
        });
      })
      .then(() => {
        CurrentCpuLoadPO.validate({
          loadAvg1m: {
            value: '111.00 %',
            class: 'has-background-danger-light',
          },
          loadAvg5m: {
            value: '101.00 %',
            class: 'has-background-danger-light',
          },
          loadAvg15m: {
            value: '100.00 %',
            class: 'has-background-warning-light',
          },
        });

        cy.tick(T_1_MINUTE);
      });
  });

  it('show again a notification about CPU high load', () => {
    cy.clock(TIMESTAMP);

    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP + 0.5 * T_1_MINUTE,
          data: { loadAvg1m: 1.2345, loadAvg5m: 1.1234, loadAvg15m: 1.0123 },
        });
      })
      .then(() => {
        NotificationPO.validateTop('Your CPU is under high average load!');
        NotificationPO.validateToast(
          'Your CPU has just went under high average load!'
        );

        cy.tick(T_1_MINUTE);
      });
  });

  it('expects the incident second row is added', () => {
    IncidentsPO.validate([
      [
        {
          No: '2',
          Description: 'high average CPU load',
          'Started At': formatDate(TIMESTAMP - 1.5 * T_1_MINUTE),
          'Ended At': '—',
          Duration: '—',
          Status: 'ongoing',
        },
        {
          No: '1',
          Description: 'high average CPU load',
          'Started At': formatDate(TIMESTAMP - 7 * T_1_MINUTE),
          'Ended At': formatDate(TIMESTAMP - 4 * T_1_MINUTE),
          Duration: '3 minutes',
          Status: 'resolved',
        },
      ],
    ]);
  });

  it('recover again', () => {
    cy.clock(TIMESTAMP);

    cy.window()
      .then((window) => {
        addDataPoint(window, {
          timestamp: TIMESTAMP + 1 * T_1_MINUTE - 1000,
          data: { loadAvg1m: 0.91, loadAvg5m: 0.93, loadAvg15m: 0.94 },
        });

        addDataPoint(window, {
          timestamp: TIMESTAMP + 3 * T_1_MINUTE,
          data: { loadAvg1m: 0.9, loadAvg5m: 0.91, loadAvg15m: 0.92 },
        });
      })
      .then(() => {
        NotificationPO.expectTopHidden();
        NotificationPO.validateToast(
          'Your CPU has just recovered from high average load!'
        );

        cy.tick(T_1_MINUTE);
      });
  });

  it('expects the second row is updated', () => {
    IncidentsPO.validate([
      [
        {
          No: '2',
          Description: 'high average CPU load',
          'Started At': formatDate(TIMESTAMP - 1.5 * T_1_MINUTE),
          'Ended At': formatDate(TIMESTAMP + 1 * T_1_MINUTE - 1000),
          Duration: '2 minutes 29 seconds',
          Status: 'resolved',
        },
        {
          No: '1',
          Description: 'high average CPU load',
          'Started At': formatDate(TIMESTAMP - 7 * T_1_MINUTE),
          'Ended At': formatDate(TIMESTAMP - 4 * T_1_MINUTE),
          Duration: '3 minutes',
          Status: 'resolved',
        },
      ],
    ]);
  });
});
