const { db, isDatabaseInitialized } = require('./init_db');
const seedAllTables = require('./seed_from_excel');
(async () => {
    try {
        const initialized = await isDatabaseInitialized();

        if (!initialized) {
            console.log('Database not initialized. Seeding now...');
            await seedAllTables(db);
        } else {
            console.log('Database already initialized. Skipping seeding.');
        }
    } catch (err) {
        console.error('Error checking daatbase initialization:', err);
    }
})();
module.exports = db;