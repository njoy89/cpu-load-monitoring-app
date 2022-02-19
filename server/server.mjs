import * as os from 'os';
import { WebSocketServer } from 'ws';
import { exec } from 'child_process';

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

    const messageType = message?.type;

    switch (messageType) {
      case 'init': {
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

        break;
      }
      case 'stress': {
        exec('stress --cpu 16 --io 8 --vm 4 --vm-bytes 256M --timeout 10s', (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });

        break;
      }
    }
  });

  ws.on('close', () => {
    console.log('closing connection');

    clearInterval(interval);
  });
});
