const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all active users
router.get('/', (req, res) => {
    db.all(
        `SELECT * FROM Users WHERE user_state != 'deleted'`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

module.exports = router;