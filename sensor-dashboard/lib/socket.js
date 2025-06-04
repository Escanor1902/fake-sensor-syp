// sensor-dashboard/lib/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // dein Express-Server

export default socket;