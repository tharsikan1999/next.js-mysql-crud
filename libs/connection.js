// libs/connection.js

import mysql from 'mysql';

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
}
);

export default db; 
