export const FETCH_TIMEOUT = 300;

export const WS_ADDRESS =
  process.env.NODE_ENV === 'production'
    ? 'ws://18.216.177.91:8080/'
    : 'ws://localhost:8080';
