const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all teacher-course associations or specific ones by teacher_id or course_id
router.get('/teacher_course', async (req, res) => {
    const teacher_id = req.query.teacher_id || req.body.teacher_id;
    const course_id = req.query.course_id || req.body.course_id;

    const connection = await db.getConnection();

    let query = "SELECT * FROM teacher_course";
    const params = [];

    if (teacher_id && course_id) {
        query += " WHERE teacher_id = ? AND course_id = ?";
        params.push(teacher_id, course_id);
    } else if (teacher_id) {
        query += " WHERE teacher_id = ?";
        params.push(teacher_id);
    } else if (course_id) {
        query += " WHERE course_id = ?";
        params.push(course_id);
    }

    const [teacherCourseData] = await connection.query(query, params);

    if (teacherCourseData.length === 0) {
        return res.status(404).json({ message: 'No teacher-course association data found' });
    }

    return res.status(200).json({
        message: 'Teacher-course association data retrieved successfully',
        teacher_course: teacherCourseData
    });
});

// Insert new teacher-course association
router.post('/teacher_course', async (req, res) => {
    const { teacher_id, course_id } = req.body;

    const connection = await db.getConnection();

    const [teacherCourseData] = await connection.query(
        "INSERT INTO teacher_course (teacher_id, course_id) VALUES (?, ?)",
        [teacher_id, course_id]
    );

    if (teacherCourseData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not insert teacher-course association data' });
    }

    return res.status(200).json({
        message: 'Teacher-course association inserted successfully',
    });
});

// Delete teacher-course association
router.delete('/teacher_course', async (req, res) => {
    const teacher_id = req.query.teacher_id || req.body.teacher_id;
    const course_id = req.query.course_id || req.body.course_id;

    if (!teacher_id || !course_id) {
        return res.status(400).json({ message: 'Both teacher_id and course_id are required for deletion' });
    }

    const connection = await db.getConnection();

    const [teacherCourseData] = await connection.query(
        "DELETE FROM teacher_course WHERE teacher_id = ? AND course_id = ?",
        [teacher_id, course_id]
    );

    if (teacherCourseData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not delete non-existing teacher-course association data' });
    }

    return res.status(200).json({
        message: 'Teacher-course association deleted successfully',
    });
});

module.exports = router;