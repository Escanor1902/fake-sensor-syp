'use client';

import { useState, useEffect } from 'react';
import SensorChart from '../../components/SensorChart.js';

export default function Home() {
  const [date, setDate] = useState('2023-01-01');
  const [sensorData, setSensorData] = useState([]);
  const today = new Date().toISOString().split('T')[0];

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
    </main>
  );
}
