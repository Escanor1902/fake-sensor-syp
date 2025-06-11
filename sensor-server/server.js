const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'HeTian?',
  database: 'fakesensor',
};

app.get('/', (req, res) => res.send('Sensor-Server läuft'));

app.get('/api/sensor-data', async (req, res) => {
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({ error: 'date ist erforderlich' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT temperatur, luftfeuchtigkeit, zeitstempel 
       FROM messwerte
       WHERE DATE(zeitstempel) = ?
       ORDER BY zeitstempel ASC`,
      [date]
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('DB-Abfrage Fehler:', error);
    res.status(500).json({ error: 'DB-Abfrage fehlgeschlagen' });
  }
});

setInterval(async () => {
  const sensorData = {
    temperature: (20 + Math.random() * 10).toFixed(2),
    humidity: (40 + Math.random() * 20).toFixed(2),
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };

  io.emit('sensorData', sensorData);

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO messwerte (temperatur, luftfeuchtigkeit, zeitstempel) VALUES (?, ?, ?)',
      [sensorData.temperature, sensorData.humidity, sensorData.timestamp]
    );
    await connection.end();
  } catch (err) {
    console.error('Fehler beim Speichern in der DB:', err);
  }
}, 2000);

server.listen(3000, () => {
  console.log('Sensor-Server läuft auf http://localhost:3000');
});
