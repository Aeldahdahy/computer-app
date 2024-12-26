const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get class data
router.get('/class', async (req, res) => {
    const class_id = req.query.class_id || req.body.class_id || req.params.class_id;

    const connection = await db.getConnection();

    if (class_id == '%') {
        const [classData] = await connection.query(
            "SELECT * FROM class WHERE class_id LIKE ?",
            [class_id]
        );
        
        if (classData.length === 0) {
            return res.status(404).json({ message: 'No class data found' });
        }

        return res.status(200).json({
            message: 'Class data retrieved successfully',
            class: classData
        });
    } else {
        const [classData] = await connection.query(
            "SELECT * FROM class WHERE class_id = ?",
            [class_id]
        );

        if (classData.length === 0) {
            return res.status(404).json({ message: 'No class data found' });
        }

        return res.status(200).json({
            message: 'Class data retrieved successfully',
            class: classData
        });
    }
});

// Insert class data
router.post('/class', async (req, res) => {
    const { scheduled_time, room_number, course_id, tearcher_id } = req.body;
    
    const connection = await db.getConnection();

    const [classData] = await connection.query(
        "INSERT INTO class (scheduled_time, room_number, course_id, tearcher_id) VALUES (?, ?, ?, ?)",
        [scheduled_time, room_number, course_id, tearcher_id]
    );

    if (classData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not insert class data' });
    }

    return res.status(200).json({
        message: 'Class data inserted successfully',
    });
});

// Delete class data
router.delete('/class', async (req, res) => {
    const class_id = req.query.class_id || req.body.class_id || req.params.class_id;

    const connection = await db.getConnection();

    const [classData] = await connection.query(
        "DELETE FROM class WHERE class_id = ?",
        [class_id]
    );

    if (classData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not delete non-existing class data' });
    }

    return res.status(200).json({
        message: 'Class data deleted successfully',
    });
});

// Update class data
router.put('/class', async (req, res) => {
    const class_id = req.query.class_id || req.body.class_id || req.params.class_id;
    const { scheduled_time, room_number, course_id, tearcher_id } = req.body;

    const connection = await db.getConnection();

    const [classData] = await connection.query(
        "UPDATE class SET scheduled_time = ?, room_number = ?, course_id = ?, tearcher_id = ? WHERE class_id = ?",
        [scheduled_time, room_number, course_id, tearcher_id, class_id]
    );

    if (classData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not update non-existing class data' });
    }

    return res.status(200).json({
        message: 'Class data updated successfully',
    });
});

module.exports = router;