'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SensorChart from '../../components/SensorChart.js';
import SensorGauges from '../../components/SensorGauges.js';

export default function Home() {
  const [date, setDate] = useState('2023-01-01');
  const [sensorData, setSensorData] = useState([]);   // API-Daten für Chart
  const [liveData, setLiveData] = useState({          // Live-Daten für Gauges
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    uvIndex: 0,
  });

  const today = new Date().toISOString().split('T')[0];

  // Daten per HTTP-API laden, wenn sich das Datum ändert
  useEffect(() => {
    async function fetchData() {
      if (!date) return;
      try {
        const res = await fetch(`http://localhost:3000/api/sensor-data?date=${date}`);
        const data = await res.json();
        setSensorData(data);
      } catch (error) {
        console.error('Fehler beim Laden der Sensordaten:', error);
      }
    }
    fetchData();
  }, [date]);

  // Socket.io-Verbindung aufbauen für Live-Daten
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('sensorData', (data) => {
      setLiveData({
        temperature: parseFloat(data.temperature),
        humidity: parseFloat(data.humidity),
        windSpeed: parseFloat(data.windSpeed),
        uvIndex: parseInt(data.uvIndex, 10),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Werte für Gauges aus liveData
  const gaugeValues = {
    temp: liveData.temperature,
    humidity: liveData.humidity,
    wind: liveData.windSpeed,
    uv: liveData.uvIndex,
  };

  return (
    <main>
      <h1>Live Sensor Dashboard</h1>
      <div className="chart">
        <div className="date">
          <label htmlFor="start" className="dateInput">Start date:</label>
          <input
            type="date"
            id="start"
            name="trip-start"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min="2023-01-01"
            max={today}
            className="border rounded p-2"
          />
        </div>
        <SensorChart data={sensorData} />
      </div>

      
      <div className='right-side'>
        <div className="gauge-grid">
        <SensorGauges values={gaugeValues} />
        </div>
      </div>
    </main>
  );
}