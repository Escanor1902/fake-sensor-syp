const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
cors: {
origin: 'http://localhost:3001', // Dein Frontend (React/Next)
methods: ['GET', 'POST'],
},
});

app.use(cors());
app.get('/', (req, res) => res.send('Sensor-Server läuft'));

setInterval(() => {
const sensorData = {
temperature: (20 + Math.random() * 10).toFixed(2),
humidity: (40 + Math.random() * 20).toFixed(2),
timestamp: new Date().toISOString(),
};
io.emit('sensorData', sensorData);
}, 2000);

server.listen(3000, () => {
console.log('Sensor-Server läuft auf http://localhost:3000');
});