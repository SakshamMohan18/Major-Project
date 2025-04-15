const express = require('express');
const http = require('http');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // React app address
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// SerialPort Setup (replace 'COM10' with your actual port if needed)
const port = new SerialPort({
  path: 'COM10',
  baudRate: 9600
});

port.on('open', () => {
  console.log('Serial Port Opened');
});

port.on('data', (data) => {
  const scannedData = data.toString().trim();
  console.log('Scanned Data:', scannedData);
  io.emit('scannedData', scannedData);  // Send data to all connected clients
});

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(3006, () => {
  console.log('Server running on port 3006');
});
