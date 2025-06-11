'use client';

import { useState, useEffect } from 'react';
import SensorChart from '../../components/SensorChart.js';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('');
  const [sensorData, setSensorData] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const isLive = selectedDate === '' || selectedDate === today;

  useEffect(() => {
    if (isLive) {
      setSensorData([]); // clear old data if switching to live mode
      return;
    }

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
  }, [selectedDate, isLive]);

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
    </main>
  );
}
