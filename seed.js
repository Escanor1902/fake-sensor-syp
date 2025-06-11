const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'HeTian?',
  database: 'fakesensor',
};

// Generate a timestamp for a specific date + random time in that day
function getRandomTimeOnDate(date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  const randomTime = new Date(dayStart.getTime() + Math.random() * (dayEnd.getTime() - dayStart.getTime()));
  return randomTime.toISOString().slice(0, 19).replace('T', ' ');
}

async function seedDatabase(entriesPerDay = 10, startDate = '2023-01-01', endDate = null) {
  endDate = endDate || new Date().toISOString().slice(0, 10); // today if not provided

  const connection = await mysql.createConnection(dbConfig);

  let currentDate = new Date(startDate);

  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const dateString = currentDate.toISOString().slice(0, 10);

    for (let i = 0; i < entriesPerDay; i++) {
      const temperature = (20 + Math.random() * 10).toFixed(2);
      const humidity = (40 + Math.random() * 20).toFixed(2);
      const timestamp = getRandomTimeOnDate(dateString);

      try {
        await connection.execute(
          'INSERT INTO messwerte (temperatur, luftfeuchtigkeit, zeitstempel) VALUES (?, ?, ?)',
          [temperature, humidity, timestamp]
        );
      } catch (err) {
        console.error('Fehler beim Seed-Speichern:', err);
      }
    }

    // next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  await connection.end();
  console.log(`Historische Einträge eingefügt: ${entriesPerDay} pro Tag von ${startDate} bis ${endDate}.`);
}

// Usage: Generate 10 entries per day from 2023-01-01 to yesterday
seedDatabase(10, '2023-01-01', new Date(Date.now() - 86400000).toISOString().slice(0, 10))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
