const express = require('express');
const router = express.Router();
const db = require('../db/db');
const verifyToken = require('../middleware/authMiddleware');

// Get class data
router.get('/class', async (req, res) => {
    const class_id = req.query.class_id || req.body.class_id || req.params.class_id;

    const connection = await db.getConnection();

    try {
        let classData;
        if (class_id) {
            [classData] = await connection.query(
                `
                SELECT  cl.class_id, cl.scheduled_time, cl.room_number, cl.course_id, cl.teacher_id, co.course_name, t.full_name 
                FROM class cl 
                INNER JOIN course co ON cl.course_id = co.course_id
                INNER JOIN teacher t ON cl.teacher_id = t.teacher_id
                WHERE class_id = ?`,
                [class_id]
            );
        } else {
            [classData] = await connection.query(
                `SELECT  cl.class_id, cl.scheduled_time, cl.room_number, cl.course_id, cl.teacher_id, co.course_name, t.full_name 
                FROM class cl 
                INNER JOIN course co ON cl.course_id = co.course_id
                INNER JOIN teacher t ON cl.teacher_id = t.teacher_id
                ORDER BY cl.class_id`
            );
        }

        if (classData.length === 0) {
            return res.status(404).json({ message: 'No class data found' });
        }

        res.status(200).json({
            message: 'Class data retrieved successfully',
            class: classData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// Insert class data
router.post('/class', verifyToken, async (req, res) => {
    const { scheduled_time, room_number, course_id, teacher_id } = req.body;
    
    if (!scheduled_time || !room_number || !course_id || !teacher_id) {
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    const connection = await db.getConnection();

    try {
        // Check if course_id exists
        const [courseData] = await connection.query(
            "SELECT * FROM course WHERE course_id = ?",
            [course_id]
        );

        if (courseData.length === 0) {
            return res.status(400).json({ message: 'Invalid course_id' });
        }

        // Check if teacher_id exists
        const [teacherData] = await connection.query(
            "SELECT * FROM teacher WHERE teacher_id = ?",
            [teacher_id]
        );

        if (teacherData.length === 0) {
            return res.status(400).json({ message: 'Invalid teacher_id' });
        }

        const [classData] = await connection.query(
            "INSERT INTO class (scheduled_time, room_number, course_id, teacher_id) VALUES (?, ?, ?, ?)",
            [scheduled_time, room_number, course_id, teacher_id]
        );

        if (classData.affectedRows === 0) {
            return res.status(500).json({ message: 'Error creating class' });
        }

        res.status(200).json({
            message: 'Class created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// Update class data
router.put('/class', verifyToken, async (req, res) => {
    const { class_id, scheduled_time, room_number, course_id, teacher_id } = req.body;

    if (!class_id || (!scheduled_time && !room_number && !course_id && !teacher_id)) {
        return res.status(400).json({ message: 'Please provide class_id and at least one field to update' });
    }

    const connection = await db.getConnection();

    let updateFields = [];
    let updateParams = [];

    if (scheduled_time) {
        updateFields.push('scheduled_time = ?');
        updateParams.push(scheduled_time);
    }
    if (room_number) {
        updateFields.push('room_number = ?');
        updateParams.push(room_number);
    }
    if (course_id) {
        // Check if course_id exists
        const [courseData] = await connection.query(
            "SELECT * FROM course WHERE course_id = ?",
            [course_id]
        );

        if (courseData.length === 0) {
            return res.status(400).json({ message: 'Invalid course_id' });
        }

        updateFields.push('course_id = ?');
        updateParams.push(course_id);
    }
    if (teacher_id) {
        // Check if teacher_id exists
        const [teacherData] = await connection.query(
            "SELECT * FROM teacher WHERE teacher_id = ?",
            [teacher_id]
        );

        if (teacherData.length === 0) {
            return res.status(400).json({ message: 'Invalid teacher_id' });
        }

        updateFields.push('teacher_id = ?');
        updateParams.push(teacher_id);
    }

    updateParams.push(class_id);

    const updateQuery = `UPDATE class
                         SET ${updateFields.join(', ')}
                         WHERE class_id = ?`;

    try {
        const [classData] = await connection.query(updateQuery, updateParams);

        if (classData.affectedRows === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// Delete class data
router.delete('/class', verifyToken, async (req, res) => {
    const { class_id } = req.body;

    if (!class_id) {
        return res.status(400).json({ message: 'class_id is required' });
    }

    const connection = await db.getConnection();

    try {
        const [classData] = await connection.query(
            "DELETE FROM class WHERE class_id = ?",
            [class_id]
        );

        if (classData.affectedRows === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

module.exports = router;