const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all student-course associations or specific ones by student_id or course_id
router.get('/student_course', async (req, res) => {
    const student_id = req.query.student_id || req.body.student_id;
    const course_id = req.query.course_id || req.body.course_id;

    const connection = await db.getConnection();

    let query = "SELECT * FROM student_course";
    const params = [];

    if (student_id && course_id) {
        query += " WHERE student_id = ? AND course_id = ?";
        params.push(student_id, course_id);
    } else if (student_id) {
        query += " WHERE student_id = ?";
        params.push(student_id);
    } else if (course_id) {
        query += " WHERE course_id = ?";
        params.push(course_id);
    }

    const [studentCourseData] = await connection.query(query, params);

    if (studentCourseData.length === 0) {
        return res.status(404).json({ message: 'No student-course association data found' });
    }

    return res.status(200).json({
        message: 'Student-course association data retrieved successfully',
        student_course: studentCourseData
    });
});

// Insert new student-course association
router.post('/student_course', async (req, res) => {
    const { student_id, course_id } = req.body;

    const connection = await db.getConnection();

    const [studentCourseData] = await connection.query(
        "INSERT INTO student_course (student_id, course_id) VALUES (?, ?)",
        [student_id, course_id]
    );

    if (studentCourseData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not insert student-course association data' });
    }

    return res.status(200).json({
        message: 'Student-course association inserted successfully',
    });
});

// Delete student-course association
router.delete('/student_course', async (req, res) => {
    const student_id = req.query.student_id || req.body.student_id;
    const course_id = req.query.course_id || req.body.course_id;

    if (!student_id || !course_id) {
        return res.status(400).json({ message: 'Both student_id and course_id are required for deletion' });
    }

    const connection = await db.getConnection();

    const [studentCourseData] = await connection.query(
        "DELETE FROM student_course WHERE student_id = ? AND course_id = ?",
        [student_id, course_id]
    );

    if (studentCourseData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not delete non-existing student-course association data' });
    }

    return res.status(200).json({
        message: 'Student-course association deleted successfully',
    });
});

module.exports = router;
