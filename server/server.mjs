import * as os from 'os';
import * as http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { exec } from 'child_process';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(join(__dirname, './../build')))

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

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

server.listen(8080, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
