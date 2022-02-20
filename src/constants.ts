export const WS_ADDRESS =
  process.env.NODE_ENV === 'production'
    ? 'ws://cpu-load-monitoring-app.com'
    : 'ws://localhost:8080';

const MS_TO_S = 1000;
export const T_1_MINUTE = MS_TO_S * 60;

// Product requirement:
// - The front-end application should retrieve CPU load information every 10 seconds
export const FETCH_TIMEOUT = 3 * MS_TO_S;
// TODO

// - A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.
// - A CPU is considered recovered from high average load when it drops below 1 for 2 minutes or more.
export const MIN_DURATION_TO_ALERT = 10 * MS_TO_S;
// TODO

// Product requirement:
// - The front-end application should maintain a 10 minutes window of historical CPU load information.
export const WINDOW_DURATION = 10 * T_1_MINUTE;

export const LOW_LOAD_COLOR = '#effaf3';
export const ELEVATED_LOAD_COLOR = '#fffbeb';
export const HIGH_LOAD_COLOR = '#feecf0';

export const LOW_LOAD_THRESHOLD_BEGIN = 0;
export const LOW_LOAD_THRESHOLD_END = 60;
export const ELEVATED_LOAD_THRESHOLD_BEGIN = 60;
export const ELEVATED_LOAD_THRESHOLD_END = 100;
export const HIGH_LOAD_THRESHOLD_BEGIN = 100;
