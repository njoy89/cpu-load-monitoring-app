import { format } from 'date-fns';

export const formatDate = (timestamp: number): string =>
  format(new Date(timestamp), 'yyyy/MM/dd HH:mm:ss.SSS a');
