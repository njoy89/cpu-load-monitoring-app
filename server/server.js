import * as os from 'os';
import { WebSocketServer } from 'ws';

const webSocketServer = new WebSocketServer({ port: 8080 });

webSocketServer.on('connection', (ws) => {
  console.log('connection established');

  let interval = null;

  ws.on('message', (messageRawData) => {
    let message = null;

    try {
      message = JSON.parse(messageRawData);
    } catch {
      // no-op
    }

    if (message?.type === 'initTimeout') {
      const timeout = message.timeout;

      interval = setInterval(() => {
        const cpus = os.cpus().length;
        const [loadAvg1m, loadAvg5m, loadAvg15m] = os.loadavg();

        ws.send(
          JSON.stringify({
            type: 'avgLoad',
            data: {
              loadAvg1m: loadAvg1m / cpus,
              loadAvg5m: loadAvg5m / cpus,
              loadAvg15m: loadAvg15m / cpus,
            },
            timestamp: Date.now(),
          })
        );
      }, timeout);
    }
  });

  ws.on('close', () => {
    console.log('closing connection');

    clearInterval(interval);
  });
});
