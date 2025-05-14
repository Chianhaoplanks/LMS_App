const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/login', async (req, res) => {
    try {
        const { loginId } = req.body;
        if (loginId === 'admin') {

            const user = {
                user_id: 1,
                user_name: 'admin'
            };
            res.json({
                user,
                message: 'Login successful'
            });
        } else {
            const user = await db.getAsync(`
            SELECT u.user_id, u.user_name 
            FROM Users u
            JOIN Login l ON u.user_id = l.user_id
            WHERE l.user_login_id = ? 
                AND u.user_state = 'registered'
            `, [loginId]);

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            res.json({
                user,
                message: 'Login successful'
            });
        }


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;