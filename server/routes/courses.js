const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', async (req, res) => {
  try {
    const courses = await db.allAsync(`SELECT * FROM COURSES`);
    const coursesWithTopics = await Promise.all(
      courses.map(async (course) => {
        const topics = await db.allAsync(`
            SELECT * FROM Topics 
            WHERE course_id = ? 
              AND topic_state = 'active'
            ORDER BY topic_created_at DESC
          `, [course.course_id]);

        return { ...course, topics };
      })
    );

    res.json(coursesWithTopics);
  } catch (err) {
    console.error('Error fetching courses and topics:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get all active courses the user is enrolled in
    const courses = await db.allAsync(`
      SELECT c.* 
      FROM Courses c
      JOIN Enrollment e ON c.course_id = e.course_id
      WHERE e.user_id = ? 
        AND e.enrollment_state = 'active'
      ORDER BY c.course_name
    `, [userId]);

    // For each course, get its active topics
    const coursesWithTopics = await Promise.all(
      courses.map(async (course) => {
        const topics = await db.allAsync(`
          SELECT * FROM Topics 
          WHERE course_id = ? 
            AND topic_state = 'active'
          ORDER BY topic_created_at DESC
        `, [course.course_id]);

        return { ...course, topics };
      })
    );

    res.json(coursesWithTopics);
  } catch (err) {
    console.error('Error fetching courses and topics:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;