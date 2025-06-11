'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SensorChart from '../../components/SensorChart.js';
import SensorGauges from '../../components/SensorGauges.js';

export default function Home() {

  const [selectedDate, setSelectedDate] = useState('');
  const [date, setDate] = useState('2023-01-01');
  const [sensorData, setSensorData] = useState([]);   // API-Daten für Chart
  const [liveData, setLiveData] = useState({          // Live-Daten für Gauges
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    uvIndex: 0,
  });

  const today = new Date().toISOString().split('T')[0];
  const isLive = selectedDate === '' || selectedDate === today;

  // Daten per HTTP-API laden, wenn sich das Datum ändert
useEffect(() => {
  if (!selectedDate) {
    setSensorData([]);
    return;
  }

  // Immer zurücksetzen, bevor neu geladen wird
  setSensorData([]);

  async function fetchData() {
    try {
      const res = await fetch(`http://localhost:3000/api/sensor-data?date=${selectedDate}`);
      const data = await res.json();
      setSensorData(data);
    } catch (error) {
      console.error('Fehler beim Laden der Sensordaten:', error);
    }
  }

  fetchData();
}, [selectedDate]);



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

    const nowDate = new Date().toISOString().split('T')[0];
    if (selectedDate === nowDate) {
      setSensorData(prev => [
        ...prev,
        {
          temperatur: data.temperature,
          luftfeuchtigkeit: data.humidity,
          zeitstempel: data.timestamp,
        }
      ]);
    }
  });

  return () => {
    socket.disconnect();
  };
}, [selectedDate]);

  // Werte für Gauges aus liveData
  const gaugeValues = {
    temp: liveData.temperature,
    humidity: liveData.humidity,
    wind: liveData.windSpeed,
    uv: liveData.uvIndex,
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Sensor Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="start" className="mr-2">Datum wählen:</label>
        <input
          type="date"
          id="start"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={today}
          className="border rounded p-2"
        />
      </div>
      <SensorChart data={sensorData} isLive={isLive} />
      
      <div className='right-side'>
        <div className="gauge-grid">
          <SensorGauges values={gaugeValues} />
        </div>
      </div>
    </main>
  );
}