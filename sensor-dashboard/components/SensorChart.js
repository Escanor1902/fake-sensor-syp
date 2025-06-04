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

export default function SensorChart() {
const [labels, setLabels] = useState([]);
const [temps, setTemps] = useState([]);
const [humids, setHumids] = useState([]);
const maxLength = 20;

useEffect(() => {
socket.on('sensorData', (data) => {
setLabels((prev) => [...prev.slice(-maxLength + 1), new Date(data.timestamp).toLocaleTimeString()]);
setTemps((prev) => [...prev.slice(-maxLength + 1), data.temperature]);
setHumids((prev) => [...prev.slice(-maxLength + 1), data.humidity]);
});
return () => socket.off('sensorData');
}, []);

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