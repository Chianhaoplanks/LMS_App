const sqlite3 = require('sqlite3').verbose();
const util = require('util');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'edu.db');
const dbExists = fs.existsSync(dbPath);

function isDatabaseInitialized() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='Users'`, (err, row) => {
            if (err) return reject(err);
            resolve(!!row); // true if table exists
        });
    });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
        // Execute the schema
        if (!dbExists) {
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
            db.exec(schemaSQL, (err) => {
                if (err) {
                    console.error('Error creating tables', err);
                } else {
                    console.log('Tables created successfully.');
                }
            });
        }
    }
});

db.runAsync = function (sql, params) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID });
        });
    });
};
db.allAsync = util.promisify(db.all)
db.getAsync = util.promisify(db.get)

module.exports = { db, isDatabaseInitialized };