// test-db-connection.js

const db = require('./config/db.config');

// Attempt to connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Database connection successful!');
    db.end();  // Close the connection
});
