import React from 'react';

export const Panel: React.FunctionComponent<{}> = ({ children }) => (
  <article className="panel is-primary">{children}</article>
);

export const PanelHeader: React.FunctionComponent<{}> = ({ children }) => (
  <p className="panel-heading is-flex is-align-items-center p-2">{children}</p>
);

export const PanelBody: React.FunctionComponent<{}> = ({ children }) => (
  <div className="panel-block has-text-centered p-4 has-background-white is-justify-content-center">
    {children}
  </div>
);
