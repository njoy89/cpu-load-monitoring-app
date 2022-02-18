export const FETCH_TIMEOUT = 1000;

export const WS_ADDRESS =
  process.env.NODE_ENV === 'production'
    ? 'ws://18.216.177.91:8080/'
    : 'ws://localhost:8080';

export const T_1_MINUTE = 1000 * 60;

export const LOW_LOAD_COLOR = '#effaf3';
export const ELEVATED_LOAD_COLOR = '#fffbeb';
export const HIGH_LOAD_COLOR = '#feecf0';

export const LOW_LOAD_THRESHOLD_BEGIN = 0;
export const LOW_LOAD_THRESHOLD_END = 60;
export const ELEVATED_LOAD_THRESHOLD_BEGIN = 60;
export const ELEVATED_LOAD_THRESHOLD_END = 100;
export const HIGH_LOAD_THRESHOLD_BEGIN = 100;
