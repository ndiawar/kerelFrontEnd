const WebSocket = require('ws');
const { SerialPort } = require('serialport'); // Pour gérer la communication série
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: 'COM3', baudRate: 9600 }, (err) => {
    if (err) {
        return console.error('Error opening serial port:', err.message);
    }
    console.log('Serial Port Opened');
});


port.on('open', () => {
    console.log('Serial Port Opened');
});

port.on('error', (err) => {
    console.error('Error: ', err.message);
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    console.log('Received from Arduino:', data);
    // Broadcast the received data to all connected WebSocket clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`${data}`);
        }
    });
});
const wss = new WebSocket.Server({ port: 3004 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo the received message back to the client
    ws.send(`${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send a welcome message to the client
  // ws.send('Welcome to the WebSocket server');
});

console.log('WebSocket server is running on ws://localhost:3004');