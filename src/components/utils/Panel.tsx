import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../state/state.type';

export const Panel: React.FunctionComponent<{}> = ({ children }) => {
  const connectionState = useSelector((state: State) => state.connectionState);
  const loadingClass =
    connectionState.type === 'notInitialised' ? 'loading' : '';

  return (
    <article className={`panel is-info ${loadingClass}`}>{children}</article>
  );
};

export const PanelHeader: React.FunctionComponent<{}> = ({ children }) => (
  <p className="panel-heading is-flex is-align-items-center p-2">{children}</p>
);

export const PanelBody: React.FunctionComponent<{
  className?: string;
  dataTest?: string;
}> = ({ className, children, dataTest }) => (
  <div
    className={`panel-block has-text-centered p-4 has-background-white is-justify-content-center ${
      className ?? ''
    }`}
    data-test={dataTest}
  >
    {children}
  </div>
);
