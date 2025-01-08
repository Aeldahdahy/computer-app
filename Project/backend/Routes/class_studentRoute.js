const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all student-class associations or specific one by class_id or student_id
router.get('/class_student', async (req, res) => {
    const class_id = req.query.class_id || req.body.class_id;
    const student_id = req.query.student_id || req.body.student_id;

    const connection = await db.getConnection();
    
    let query = "SELECT * FROM class_student";
    const params = [];

    if (class_id && student_id) {
        query += " WHERE class_id = ? AND student_id = ?";
        params.push(class_id, student_id);
    } else if (class_id) {
        query += " WHERE class_id = ?";
        params.push(class_id);
    } else if (student_id) {
        query += " WHERE student_id = ?";
        params.push(student_id);
    }

    const [classStudentData] = await connection.query(query, params);

    if (classStudentData.length === 0) {
        return res.status(404).json({ message: 'No class-student association data found' });
    }

    return res.status(200).json({
        message: 'Class-student association data retrieved successfully',
        class_student: classStudentData
    });
});

// Insert new student-class association
router.post('/class_student', async (req, res) => {
    const { class_id, student_id } = req.body;

    const connection = await db.getConnection();

    const [classStudentData] = await connection.query(
        "INSERT INTO class_student (class_id, student_id) VALUES (?, ?)",
        [class_id, student_id]
    );

    if (classStudentData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not insert class-student association data' });
    }

    return res.status(200).json({
        message: 'Class-student association inserted successfully',
    });
});

// Delete student-class association
router.delete('/class_student', async (req, res) => {
    const class_id = req.query.class_id || req.body.class_id;
    const student_id = req.query.student_id || req.body.student_id;

    if (!class_id || !student_id) {
        return res.status(400).json({ message: 'Both class_id and student_id are required for deletion' });
    }

    const connection = await db.getConnection();

    const [classStudentData] = await connection.query(
        "DELETE FROM class_student WHERE class_id = ? AND student_id = ?",
        [class_id, student_id]
    );

    if (classStudentData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not delete non-existing class-student association data' });
    }

    return res.status(200).json({
        message: 'Class-student association deleted successfully',
    });
});

module.exports = router;
