'use client';
import { useEffect, useState } from 'react';
import socket from '../lib/socket.js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function SensorChart({ data = [], isLive }) {
  const [labels, setLabels] = useState([]);
  const [temps, setTemps] = useState([]);
  const [humids, setHumids] = useState([]);
  const maxLength = 20;

  // Live chart mode (realtime updates)
  useEffect(() => {
    if (!isLive) return;

    const handleSensorData = (data) => {
      console.log('Empfangene Live-Daten im Chart:', data);
      setLabels((prev) => [...prev.slice(-maxLength + 1), new Date(data.timestamp + 'Z').toLocaleString('de-DE', {
        timeZone: 'Europe/Berlin',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })]);
      setTemps((prev) => [...prev.slice(-maxLength + 1), data.temperature]);
      setHumids((prev) => [...prev.slice(-maxLength + 1), data.humidity]);
    };

    socket.on('sensorData', handleSensorData);
    return () => socket.off('sensorData', handleSensorData);
  }, [isLive]);

  // Historical data mode
  useEffect(() => {
    if (isLive || !data.length) return;

    const historicalLabels = data.map((entry) => new Date(entry.zeitstempel).toLocaleString());
    const historicalTemps = data.map((entry) => entry.temperatur);
    const historicalHumids = data.map((entry) => entry.luftfeuchtigkeit);

    setLabels(historicalLabels);
    setTemps(historicalTemps);
    setHumids(historicalHumids);
  }, [data, isLive]);

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'Temperatur (°C)',
            data: temps,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Luftfeuchtigkeit (%)',
            data: humids,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      }}
    />
  );
}
