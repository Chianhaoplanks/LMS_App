const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    db.all(
        `SELECT * FROM Entries WHERE entry_state = 'active'`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

router.post('/', async (req, res) => {
    try {
        const { topic_id, entry_parent_id, entry_content, entry_posted_by_user_id } = req.body;
        const { lastID } = await db.runAsync(
        `INSERT INTO Entries (
        topic_id,
        entry_parent_id,
        entry_content,
        entry_posted_by_user_id,
        entry_state
        ) VALUES (?, ?, ?, ?, 'active')
       `, [topic_id, entry_parent_id, entry_content, entry_posted_by_user_id]);

        const newEntry = await db.getAsync(
        `SELECT e.*, u.user_name 
        FROM Entries e
        JOIN Users u ON e.entry_posted_by_user_id = u.user_id
        WHERE e.entry_id = ?
        `, [lastID]);

        res.status(201).json({ entry: newEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;