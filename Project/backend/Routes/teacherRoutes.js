const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');

router.get('/teacher', async (req, res) => {
    const teacher_id = req.params.teacher_id || req.query.teacher_id || req.body.teacher_id;
    const email = req.params.email || req.query.email || req.body.email;

    const connection = await db.getConnection();
    if (teacher_id && teacher_id !== '%' || email) {
        const [teacherData] = await connection.query(
            `SELECT t.teacher_id, t.fname, t.lname, t.full_name, t.email, t.phone_number, t.status, t.department_id, d.department_name
            FROM teacher t
            INNER JOIN department d ON t.department_id = d.department_id
            WHERE teacher_id = ? OR email = ?`,
            [teacher_id, email]
        );

        if (teacherData.length === 0) {
            return res.status(404).json({ message: 'Teacher account not found' });
        }

        res.status(200).json({ message: 'Teacher account retrieved successfully', teacher: teacherData[0] });
    } else {
        const [teacherData] = await connection.query(
            `SELECT t.teacher_id, t.fname, t.lname, t.full_name, t.email, t.phone_number, t.status, t.department_id, d.department_name
            FROM teacher t
            INNER JOIN department d ON t.department_id = d.department_id`
        );

        if (teacherData.length === 0) {
            return res.status(404).json({ message: 'No teacher accounts found' });
        }

        res.status(200).json({ message: 'Teacher accounts retrieved successfully', teachers: teacherData });
    }
});

router.post('/teacher', verifyToken, async (req, res) => {
    const { fname, lname, email, password, phone_number, status, department_id } = req.body;

    if (!fname || !lname || !email || !password || !phone_number || !status || !department_id) {
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const generateID = async () => {
                return Math.floor(100000 + Math.random() * 900000).toString();
            };

            const isIDUnique = async (id) => {
                const [rows] = await connection.query(
                    'SELECT COUNT(*) AS count FROM teacher WHERE teacher_id = ?',
                    [id]
                );
                return rows[0].count === 0;
            };

            let uniqueID;
            do {
                uniqueID = await generateID();
            } while (!(await isIDUnique(uniqueID)));

            let phoneNumber = `+2${phone_number}`;

            const [teacherData] = await connection.query(
                'INSERT INTO teacher(teacher_id, fname, lname, email, password, phone_number, status, department_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                [uniqueID, fname, lname, email, hashedPassword, phoneNumber, status, department_id]
            );

            if (teacherData.affectedRows === 0) {
                await connection.rollback();
                return res.status(500).json({ message: 'Error creating teacher account' });
            }

            // After creating teacher, create corresponding staff entry
            const staffUsername = `${fname} ${lname}`; // Full name as username

            const [staffData] = await connection.query(
                'INSERT INTO staff(staff_id, user_name, password, role, email, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
                [uniqueID, staffUsername, hashedPassword, 'Teacher', email, uniqueID] // Use the teacher_id as foreign key
            );

            if (staffData.affectedRows === 0) {
                await connection.rollback();
                return res.status(500).json({ message: 'Error creating staff account' });
            }

            const [newTeacher] = await connection.query(
                'SELECT teacher_id, fname, lname, email, phone_number, status, department_id FROM teacher WHERE teacher_id = ?',
                [uniqueID]
            );

            const [newStaff] = await connection.query(
                'SELECT staff_id, user_name, role, email, teacher_id FROM staff WHERE staff_id = ?',
                [uniqueID]
            );

            await connection.commit();
            res.status(200).json({ 
                message: 'Teacher and Staff accounts created successfully',
                teacher: newTeacher[0], 
                staff: newStaff[0] 
            });

        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/teacher', verifyToken, async (req, res) =>{
    const { teacher_id, fname, lname, email, password, phone_number, status, department_id } = req.body;

    if(!teacher_id || (!fname && !lname && !email && !password && !phone_number && !status && !department_id)){
        return res.status(400).json({ message: 'Please provide teacher_id and at least one field to update' });
    }

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can update teacher accounts' });
    }

    const connection = await db.getConnection();

    let updateFields = [];
    let updateParams = [];

    if(fname){
        updateFields.push('fname = ?');
        updateParams.push(fname);
    }
    if(lname){
        updateFields.push('lname = ?');
        updateParams.push(lname);
    }
    if(email){
        updateFields.push('email = ?');
        updateParams.push(email);
    }
    if(password){
        updateFields.push('password = ?');
        updateParams.push(password);
    }
    if(phone_number){
        updateFields.push('phone_number = ?');
        let phoneNumber = `+2${phone_number}`;
        updateParams.push(phoneNumber);
    }
    if(status){
        updateFields.push('status = ?');
        updateParams.push(status);
    }
    if(department_id){
        updateFields.push('department_id = ?');
        updateParams.push(department_id);
    }

    updateParams.push(teacher_id);

    const updateQuery = `UPDATE teacher
                         SET ${updateFields.join(', ')}
                         WHERE teacher_id = ?`;
    
    const [newTeacherDate] = await connection.query(updateQuery, updateParams);

    if(newTeacherDate.affectedRows === 0){
        return res.status(400).json({ message: 'teacher not found' });
    }

    const [updatedTeacherData] = await connection.query(
        'SELECT teacher_id, fname, lname, email, phone_number, department_id, status FROM teacher WHERE teacher_id = ?',
        [teacher_id]
    );

    res.status(200).json({ message: 'teacher account updated successfully', teacher: updatedTeacherData[0] });

});


router.delete('/teacher', verifyToken, async (req, res) => {
    const { teacher_id } = req.body;

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete teacher accounts' });
    }

    if (!teacher_id) {
        return res.status(400).json({ message: 'teacher_id is required' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Delete the corresponding row in the staff table
        const [deleteStaffResult] = await connection.query(
            'DELETE FROM staff WHERE teacher_id = ?',
            [teacher_id]
        );

        if (deleteStaffResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Staff account not found' });
        }

        // Delete the row in the teacher table
        const [deleteTeacherResult] = await connection.query(
            'DELETE FROM teacher WHERE teacher_id = ?',
            [teacher_id]
        );

        if (deleteTeacherResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Teacher account not found' });
        }

        await connection.commit();
        res.status(200).json({ message: 'Teacher and staff accounts deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});



module.exports = router;