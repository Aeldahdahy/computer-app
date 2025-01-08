const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');

router.get('/student', async (req, res) => {
    const student_id = req.params.student_id || req.query.student_id || req.body.student_id;
    const email = req.params.email || req.query.email || req.body.email;

    try {
        const connection = await db.getConnection();
        try {
            if (student_id && student_id !== '%' || email) {
                // Retrieve a specific student account by student_id or email
                const [studentData] = await connection.query(
                    `SELECT s.student_id, s.fname, s.lname, s.full_name, s.email, s.dob, s.phone_number, s.department_id, s.status, d.department_name 
                    FROM student s
                    INNER JOIN department d ON s.department_id = d.department_id
                    WHERE student_id = ? OR email = ?`,
                    [student_id, email]
                );

                if (studentData.length === 0) {
                    return res.status(404).json({ message: 'Student account not found' });
                }

                res.status(200).json({ message: 'Student account retrieved successfully', student: studentData[0] });
            } else {
                // Retrieve all student accounts
                const [studentData] = await connection.query(
                    `SELECT s.student_id, s.fname, s.lname, s.full_name, s.email, s.dob, s.phone_number, s.department_id, s.status, d.department_name 
                    FROM student s
                    INNER JOIN department d ON s.department_id = d.department_id`
                );

                if (studentData.length === 0) {
                    return res.status(404).json({ message: 'No student accounts found' });
                }

                res.status(200).json({ message: 'Student accounts retrieved successfully', students: studentData });
            }
        } catch (error) {
            console.error('Database query error: ', error);
            res.status(500).json({ message: 'Server error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database connection error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/createStudentAccount', verifyToken, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can create student accounts' });
    }

    const { fname, lname, email, password, dob, phone_number, department_id, status } = req.body;

    if (!fname || !lname || !email || !password || !dob || !phone_number || !department_id || !status) {
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Generate student ID based on enrollment year, dob, and phone number
            const generateID = () => {
                const enrollmentYear = new Date().getFullYear().toString().slice(-2); 
                // console.log(enrollmentYear);
                const dobFormatted = dob.replace(/-/g, '').slice(2); // YYMMDD from dob
                // console.log(dobFormatted);
                const phoneSuffix = phone_number.slice(-1); // Last 4 digits of phone number
                console.log(phoneSuffix);
                return `${enrollmentYear}${dobFormatted}${phoneSuffix}`;
            };

            const isIDUnique = async (id) => {
                const [rows] = await connection.query(
                    'SELECT COUNT(*) AS count FROM student WHERE student_id = ?',
                    [id]
                );
                return rows[0].count === 0;
            };

            // Attempt to generate a unique ID
            let uniqueID = generateID();
            console.log(uniqueID);
            if (!(await isIDUnique(uniqueID))) {
                if (!(await isIDUnique(uniqueID))) {
                    throw new Error('Could not generate a unique ID for the student');
                }
            }

            let phoneNumber = `+2${phone_number}`;
            // Insert student record into the database
            const [studentData] = await connection.query(
                'INSERT INTO student(student_id, fname, lname, email, password, dob, phone_number, department_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [uniqueID, fname, lname, email, hashedPassword, dob, phoneNumber, department_id, status]
            );

            if (studentData.affectedRows === 0) {
                await connection.rollback();
                return res.status(500).json({ message: 'Error creating student account' });
            }

            // Retrieve the newly created student data
            const [newStudent] = await connection.query(
                'SELECT student_id, fname, lname, email, dob, phone_number, department_id, status FROM student WHERE student_id = ?',
                [uniqueID]
            );

            await connection.commit();
            res.status(200).json({ message: 'Student account created successfully', student: newStudent[0] });

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

router.post('/loginStudentAccount', async (req, res) =>{
    const { student_id, password } = req.body;
    if(!student_id || !password){
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    try {
        const connection = await db.getConnection();
        try {
            const [studentData] = await connection.query(
                'SELECT * FROM student WHERE student_id = ?',
                [student_id]
            );
            
            if(studentData.length === 0){
                return res.status(404).json({ message: 'Studnet not found' });
            }

            const student = studentData[0];

            const isPasswordValid = await bcrypt.compare(password, student.password);

            if(!isPasswordValid){
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ student_id: student.student_id}, process.env.JWT_SECRET, { expiresIn: '1h' });

            delete student.password;

            res.status(200).json({ message: 'Login successfull', student: student, token: token});

        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).json({ message: 'Server error' });
        }finally{
            connection.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/student', verifyToken, async (req, res) => {
    const { student_id, fname, lname, email, password, dob, phone_number, department_id, status } = req.body;

    if (!student_id || (!fname && !lname && !email && !password && !dob && !phone_number && !department_id && !status)) {
        return res.status(400).json({ message: 'Please provide student_id and at least one field to update' });
    }

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can update student accounts' });
    }

    try {
        const connection = await db.getConnection();
        try {
            let updateFields = [];
            let updateParams = [];

            if (fname) {
                updateFields.push('fname = ?');
                updateParams.push(fname);
            }
            if (lname) {
                updateFields.push('lname = ?');
                updateParams.push(lname);
            }
            if (email) {
                updateFields.push('email = ?');
                updateParams.push(email);
            }
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateFields.push('password = ?');
                updateParams.push(hashedPassword);
            }
            if (dob) {
                updateFields.push('dob = ?');
                updateParams.push(dob);
            }
            if (phone_number) {
                updateFields.push('phone_number = ?');
                let phoneNumber = `+2${phone_number}`;
                updateParams.push(phoneNumber);
            }
            if (department_id) {
                updateFields.push('department_id = ?');
                updateParams.push(department_id);
            }
            if (status) {
                updateFields.push('status = ?');
                updateParams.push(status);
            }

            updateParams.push(student_id);

            const updateQuery = `UPDATE student 
                                 SET ${updateFields.join(', ')} 
                                 WHERE student_id = ?`;

            const [newData] = await connection.query(updateQuery, updateParams);

            if (newData.affectedRows === 0) {
                return res.status(404).json({ message: 'Student not found' });
            }

            const [updatedStudentData] = await connection.query(
                'SELECT student_id, fname, lname, email, dob, phone_number, department_id, status FROM student WHERE student_id = ?',
                [student_id]
            );

            res.status(200).json({ message: 'Student account updated successfully', student: updatedStudentData[0] });

        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).json({ message: 'Server error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/student', verifyToken, async (req, res) => {
    const { student_id } = req.body;

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete student accounts' });
    }

    if (!student_id) {
        return res.status(400).json({ message: 'student_id is required' });
    }

    try {
        const connection = await db.getConnection();
        try {
            const [deleteResult] = await connection.query(
                'DELETE FROM student WHERE student_id = ?',
                [student_id]
            );

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Student account not found' });
            }

            res.status(200).json({ message: 'Student account deleted successfully' });
        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).json({ message: 'Server error' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;