const express = require('express');
const router = express.Router();
const db = require('../db/db');
const verifyToken = require('../middleware/authMiddleware');

router.get('/course', async (req, res) => {
    const course_id = req.query.course_id || req.body.course_id || req.params.course_id;

    const connection = await db.getConnection();

    if (course_id) {
        const [courseData] = await connection.query(
            `
            SELECT c.course_id, c.course_name, c.credits, c.department_id, d.department_name 
            FROM course c 
            INNER JOIN department d ON c.department_id = d.department_id
            WHERE c.course_id = ?
            ORDER BY c.course_id`,
            [course_id]
        );

        if (courseData.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({
            message: 'Course retrieved successfully',
            course: courseData[0]
        });
    } else {
        const [courseData] = await connection.query(
            `
            SELECT c.course_id, c.course_name, c.credits, c.department_id, d.department_name 
            FROM course c 
            INNER JOIN department d ON c.department_id = d.department_id`
        );

        if (courseData.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }

        res.status(200).json({
            message: 'Courses retrieved successfully',
            course: courseData
        });
    }
});

router.post('/course', verifyToken, async (req, res) => {
    const { course_name, credits, department_id } = req.body;

    if (!course_name || !credits || !department_id) {
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    const connection = await db.getConnection();

    try {
        const [courseData] = await connection.query(
            "INSERT INTO course (course_name, credits, department_id) VALUES (?, ?, ?)",
            [course_name, credits, department_id]
        );

        if (courseData.affectedRows === 0) {
            return res.status(500).json({ message: 'Error creating course' });
        }

        res.status(200).json({
            message: 'Course created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

router.put('/course', verifyToken, async (req, res) => {
    const { course_id, course_name, credits, department_id } = req.body;

    if (!course_id || (!course_name && !credits && !department_id)) {
        return res.status(400).json({ message: 'Please provide course_id and at least one field to update' });
    }

    const connection = await db.getConnection();

    let updateFields = [];
    let updateParams = [];

    if (course_name) {
        updateFields.push('course_name = ?');
        updateParams.push(course_name);
    }
    if (credits) {
        updateFields.push('credits = ?');
        updateParams.push(credits);
    }
    if (department_id) {
        updateFields.push('department_id = ?');
        updateParams.push(department_id);
    }

    updateParams.push(course_id);

    const updateQuery = `UPDATE course
                         SET ${updateFields.join(', ')}
                         WHERE course_id = ?`;

    try {
        const [courseData] = await connection.query(updateQuery, updateParams);

        if (courseData.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

router.delete('/course', verifyToken, async (req, res) => {
    const { course_id } = req.body;

    if (!course_id) {
        return res.status(400).json({ message: 'course_id is required' });
    }

    const connection = await db.getConnection();

    try {
        const [courseData] = await connection.query(
            "DELETE FROM course WHERE course_id = ?",
            [course_id]
        );

        if (courseData.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

module.exports = router;