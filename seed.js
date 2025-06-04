// random Daten einfügen --> einmal ausgeführt 

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fakesensor',
};

function getRandomDate(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const randomTime = new Date(startTime + Math.random() * (endTime - startTime));
  return randomTime.toISOString().slice(0, 19).replace('T', ' ');
}

async function seedDatabase(numEntries = 200) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const connection = await mysql.createConnection(dbConfig);

  for (let i = 0; i < numEntries; i++) {
    const temperature = (20 + Math.random() * 10).toFixed(2);
    const humidity = (40 + Math.random() * 20).toFixed(2);
    const timestamp = getRandomDate('2023-01-01', yesterday);

    try {
      await connection.execute(
        'INSERT INTO messwerte (temperatur, luftfeuchtigkeit, zeitstempel) VALUES (?, ?, ?)',
        [temperature, humidity, timestamp]
      );
    } catch (err) {
      console.error('Fehler beim Seed-Speichern:', err);
    }
  }

  await connection.end();
  console.log(`${numEntries} historische Einträge eingefügt.`);
}

seedDatabase(1000)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
