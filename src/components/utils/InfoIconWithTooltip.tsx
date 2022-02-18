import React from 'react';

interface InfoIconWithTooltipProps {
  tooltip: string;
}

export const InfoIconWithTooltip: React.FunctionComponent<
  InfoIconWithTooltipProps
> = ({ tooltip }) => (
  <span
    className="has-tooltip-multiline has-text-centered"
    data-tooltip={tooltip}
  >
    <i className="fa-solid fa-circle-question"></i>
  </span>
);
