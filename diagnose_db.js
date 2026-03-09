import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./server/database.sqlite');

db.all("SELECT COUNT(*) as count FROM horarios", [], (err, rows) => {
    if (err) {
        console.error('Error querying database:', err.message);
    } else {
        console.log(`Total schedules in DB: ${rows[0].count}`);
    }
    db.all("SELECT COUNT(*) as count FROM solicitudes", [], (err, rows) => {
        if (err) {
            console.error('Error querying solicitudes:', err.message);
        } else {
            console.log(`Total solicitudes in DB: ${rows[0].count}`);
        }
        db.close();
    });
});
