'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SensorChart from '../../components/SensorChart.js';
import SensorGauges from '../../components/SensorGauges.js';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('');
  const [sensorData, setSensorData] = useState([]);
  const [liveData, setLiveData] = useState({
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    uvIndex: 0,
  });

  const today = new Date().toISOString().split('T')[0];

  const isLive = selectedDate === '' || selectedDate === today;

  // Daten vom Server laden (historisch oder heute)
  useEffect(() => {
    if (!selectedDate) {
      setSensorData([]);
      return;
    }

    setSensorData([]); // Verlauf vor jedem Fetch zurücksetzen

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

  // Socket.IO für Live-Daten
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
        setSensorData((prev) => [
          ...prev,
          {
            temperatur: data.temperature,
            luftfeuchtigkeit: data.humidity,
            zeitstempel: data.timestamp,
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDate]);

  const gaugeValues = {
    temp: liveData.temperature,
    humidity: liveData.humidity,
    wind: liveData.windSpeed,
    uv: liveData.uvIndex,
  };

  return (
    <>
      <h1 className="dashboard-title">Sensor Dashboard</h1>

      <main>
        <div className="left-side">
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
        </div>

        <div className="right-side">
          <SensorGauges values={gaugeValues} />
        </div>
      </main>
    </>
  );
}
