const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    db.all(
        `SELECT * FROM Topics WHERE topic_state = 'active'`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

router.get('/:topicId', async (req, res) => {
    try {
        const topic = await db.getAsync(`
        SELECT t.*, c.course_name 
        FROM Topics t
        JOIN Courses c ON t.course_id = c.course_id
        WHERE t.topic_id = ?
        `, [req.params.topicId]);

        const entries = await db.allAsync(`
        SELECT e.*, u.user_name 
        FROM Entries e
        JOIN Users u ON e.entry_posted_by_user_id = u.user_id
        WHERE e.topic_id = ? AND e.entry_state = 'active'
        ORDER BY e.entry_created_at ASC
        `, [req.params.topicId]);

        res.json({ topic, entries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;