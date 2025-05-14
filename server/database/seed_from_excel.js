const db = require('./init_db');
const xlsx = require('xlsx');
const path = require('path');

const excelPaths = {
    users: path.join(__dirname, '../../data/users.xlsx'),
    courses: path.join(__dirname, '../../data/courses.xlsx'),
    enrollment: path.join(__dirname, '../../data/enrollment.xlsx'),
    topics: path.join(__dirname, '../../data/topics.xlsx'),
    entries: path.join(__dirname, '../../data/entries.xlsx'),
    login: path.join(__dirname, '../../data/login.xlsx'),
};

async function seedAllTables(db) {
    await runQuery(db, 'PRAGMA foreign_keys = OFF');
    await seedFromExcel('Users', excelPaths.users);
    await seedFromExcel('Courses', excelPaths.courses);
    await seedFromExcel('Enrollment', excelPaths.enrollment);
    await seedFromExcel('Topics', excelPaths.topics);
    await seedFromExcel('Entries', excelPaths.entries);
    await seedFromExcel('Login', excelPaths.login);
    await runQuery(db, 'PRAGMA foreign_keys = ON');
}

async function runQuery(db, query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}


// Seed function
function seedFromExcel(tableName, excelPath) {
    return new Promise((resolve) => {
        const workbook = xlsx.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let completed = 0;
        data.forEach((row) => {
            for (const key in row) {
                if (row[key] === 'NA') {
                    row[key] = null;
                }
            }
            const columns = Object.keys(row).join(', ');
            const placeholders = Object.keys(row).fill('?').join(', ');
            const values = Object.values(row);
            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

            db.run(query, values, (err) => {
                if (err) console.error(`Error seeding ${tableName}:`, err);
                completed++;
                if (completed === data.length) resolve();
            });
        });
    })
}

module.exports = seedAllTables;