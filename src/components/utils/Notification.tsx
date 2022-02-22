import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { State } from '../../state/state.type';
import { usePrevious } from '../../utils/usePrevious.hook';

const getToastConfig = ({
  message,
  type,
}: {
  message: string;
  type: 'is-danger' | 'is-success';
}) => ({
  message,
  type,
  position: 'bottom-left',
  animate: { in: 'fadeIn', out: 'fadeOut' },
  duration: 5000,
  dismissible: true,
  appendTo: document.getElementById('toast-wrapper'),
});

const DangerNotification: React.FunctionComponent<{ message: string }> = ({
  message,
}) => (
  <div
    className="notification is-danger has-text-centered"
    data-test="top-notification"
  >
    <i className="fa-solid fa-xl fa-circle-exclamation" />{' '}
    <strong className="is-size-5">{message}</strong>
  </div>
);

export const Notification: React.FunctionComponent<{}> = () => {
  const cpuLoadState = useSelector((state: State) => state.cpuLoadState);
  const connectionState = useSelector((state: State) => state.connectionState);
  const prevCpuLoadState = usePrevious(cpuLoadState);

  useEffect(() => {
    if (
      prevCpuLoadState?.type === 'CpuLoadStateIncreasingLoad' &&
      cpuLoadState.type === 'CpuLoadStateHighCpuLoad'
    ) {
      (window as any).bulmaToast.toast(
        getToastConfig({
          message: 'Your CPU has just went under high average load!',
          type: 'is-danger',
        })
      );
    }

    if (
      prevCpuLoadState?.type === 'CpuLoadStateRecovering' &&
      cpuLoadState.type === 'CpuLoadStateCalm'
    ) {
      (window as any).bulmaToast.toast(
        getToastConfig({
          message: 'Your CPU has just recovered from high average load!',
          type: 'is-success',
        })
      );
    }
  }, [cpuLoadState, prevCpuLoadState]);

  switch (connectionState.type) {
    case 'error':
      return <DangerNotification message={connectionState.message} />;
    case 'closed':
      return <DangerNotification message="Connection lost!" />;
    default:
      return ['CpuLoadStateHighCpuLoad', 'CpuLoadStateRecovering'].includes(
        cpuLoadState.type
      ) ? (
        <DangerNotification message="Your CPU is under high average load!" />
      ) : null;
  }
};
