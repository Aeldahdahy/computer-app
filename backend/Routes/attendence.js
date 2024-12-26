const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get attendance data
router.get('/attendance', async (req, res) => {
    const attendance_id = req.query.attendance_id || req.body.attendance_id || req.params.attendance_id;

    const connection = await db.getConnection();

    if (attendance_id == '%') {
        const [attendanceData] = await connection.query(
            "SELECT * FROM attendance WHERE attendance_id LIKE ?",
            [attendance_id]
        );

        if (attendanceData.length === 0) {
            return res.status(404).json({ message: 'No attendance data found' });
        }

        return res.status(200).json({
            message: 'Attendance data retrieved successfully',
            attendance: attendanceData
        });
    } else {
        const [attendanceData] = await connection.query(
            "SELECT * FROM attendance WHERE attendance_id = ?",
            [attendance_id]
        );

        if (attendanceData.length === 0) {
            return res.status(404).json({ message: 'No attendance data found' });
        }

        return res.status(200).json({
            message: 'Attendance data retrieved successfully',
            attendance: attendanceData
        });
    }
});

// Insert attendance data
router.post('/attendance', async (req, res) => {
    const { date, status, remarks, student_id, class_id } = req.body;

    const connection = await db.getConnection();

    const [attendanceData] = await connection.query(
        "INSERT INTO attendance (date, status, remarks, student_id, class_id) VALUES (?, ?, ?, ?, ?)",
        [date, status, remarks, student_id, class_id]
    );

    if (attendanceData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not insert attendance data' });
    }

    return res.status(200).json({
        message: 'Attendance data inserted successfully',
    });
});

// Delete attendance data
router.delete('/attendance', async (req, res) => {
    const attendance_id = req.query.attendance_id || req.body.attendance_id || req.params.attendance_id;

    const connection = await db.getConnection();

    const [attendanceData] = await connection.query(
        "DELETE FROM attendance WHERE attendance_id = ?",
        [attendance_id]
    );

    if (attendanceData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not delete non-existing attendance data' });
    }

    return res.status(200).json({
        message: 'Attendance data deleted successfully',
    });
});

// Update attendance data
router.put('/attendance', async (req, res) => {
    const attendance_id = req.query.attendance_id || req.body.attendance_id || req.params.attendance_id;
    const { date, status, remarks, student_id, class_id } = req.body;

    const connection = await db.getConnection();

    const [attendanceData] = await connection.query(
        "UPDATE attendance SET date = ?, status = ?, remarks = ?, student_id = ?, class_id = ? WHERE attendance_id = ?",
        [date, status, remarks, student_id, class_id, attendance_id]
    );

    if (attendanceData.affectedRows === 0) {
        return res.status(401).json({ message: 'Could not update non-existing attendance data' });
    }

    return res.status(200).json({
        message: 'Attendance data updated successfully',
    });
});

module.exports = router;
