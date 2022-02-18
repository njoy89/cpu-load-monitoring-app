import React from 'react';

interface TimeRangePickerProps {
  value: string;
}

export const TimeRangePicker: React.FunctionComponent<TimeRangePickerProps> = ({
  value,
}) => (
  <span
    className="tag is-info is-medium is-light"
    data-tooltip="Time range picker TODO"
  >
    {value}
  </span>
);
