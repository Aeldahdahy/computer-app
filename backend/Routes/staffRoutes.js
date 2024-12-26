const express = require('express');
const router = express.Router();
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');

const bcrypt = require('bcrypt');


// show staff information logic
router.get('/staff', async (req, res) => {
    const staff_id = req.params.staff_id || req.query.staff_id || req.body.staff_id;
    const email = req.params.email || req.query.email || req.body.email;

    try {
        const connection = await db.getConnection();
        try {
            if (staff_id && staff_id !== '%' || email) {
                // Retrieve a specific staff account by staff_id
                const [staffData] = await connection.query(
                    'SELECT staff_id, user_name, role, email FROM staff WHERE staff_id = ? OR email = ?', 
                    [staff_id, email]
                );

                if (staffData.length === 0) {
                    res.status(404).json({ message: 'Staff account not found' });
                    return;
                }
                
                res.status(200).json({ message: 'Staff account retrieved successfully', staff: staffData[0] });
            } else {
                // Retrieve all staff accounts
                const [staffData] = await connection.query(
                    'SELECT staff_id, user_name, role, email FROM staff'
                );

                if (staffData.length === 0) {
                    res.status(404).json({ message: 'No staff accounts found' });
                    return;
                }

                res.status(200).json({ message: 'Staff accounts retrieved successfully', staff: staffData });
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

// create staff logic (the Authority is only for the Admin)
router.post('/createStaffAccount', verifyToken, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can create staff accounts' });
    }

    const { username, password, role, email } = req.body;

    if (!username || !password || !role || !email) {
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
                    'SELECT COUNT(*) AS count FROM staff WHERE staff_id = ?',
                    [id]
                );
                return rows[0].count === 0;
            };

            let uniqueID;
            do {
                uniqueID = await generateID();
            } while (!(await isIDUnique(uniqueID)));

            const [staffData] = await connection.query(
                'INSERT INTO staff(staff_id, user_name, password, role, email) VALUES (?, ?, ?, ?, ?)',
                [uniqueID, username, hashedPassword, role, email]
            );

            if (staffData.affectedRows === 0) {
                await connection.rollback();
                return res.status(500).json({ message: 'Error creating user' });
            }

            const [newUser] = await connection.query(
                'SELECT staff_id, user_name, role, email FROM staff WHERE staff_id = ?',
                [uniqueID]
            );

            await connection.commit();
            res.status(200).json({ message: 'User created successfully', user: newUser[0] });

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

// staff log-in logic 
router.post('/loginStaffAccount', async (req, res) => {
    const { staff_id, password } = req.body;

    if (!staff_id || !password) {
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    try {
        const connection = await db.getConnection();
        try {
            const [staffData] = await connection.query(
                'SELECT * FROM staff WHERE staff_id = ?',
                [staff_id]
            );

            if (staffData.length === 0) {
                return res.status(404).json({ message: 'Staff not found' });
            }

            const staff = staffData[0];

            const isPasswordValid = await bcrypt.compare(password, staff.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ staff_id: staff.staff_id, role: staff.role, name: staff.user_name }, process.env.JWT_SECRET, { expiresIn: '1h' });

            delete staff.password;

            res.status(200).json({ message: 'Login successful', staff: staff, token: token });

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

// edit staff information logic (the Authority is only for the Admin)
router.put('/staff', verifyToken, async (req, res) => {
    const { staff_id, username, password, role, email } = req.body;

    if (!staff_id || (!username && !password && !role && !email)) {
        return res.status(400).json({ message: 'Please provide staff_id and at least one field to update' });
    }

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can update staff accounts' });
    }

    try {
        const connection = await db.getConnection();
        try {
            let updateFields = [];
            let updateParams = [];

            if (username) {
                updateFields.push('user_name = ?');
                updateParams.push(username);
            }

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateFields.push('password = ?');
                updateParams.push(hashedPassword);
            }

            if (role) {
                updateFields.push('role = ?');
                updateParams.push(role);
            }

            if (email) {
                updateFields.push('email = ?');
                updateParams.push(email);
            }

            updateParams.push(staff_id);

            const updateQuery = `UPDATE staff 
                                 SET ${updateFields.join(',')} WHERE staff_id = ?`;

            const [newData] = await connection.query(updateQuery, updateParams);

            if (newData.affectedRows === 0) {
                return res.status(404).json({ message: 'Staff not found' });
            }

            const [updatestaffData] = await connection.query(
                'SELECT staff_id, user_name, role, email FROM staff WHERE staff_id = ?',
                [staff_id]
            );

            res.status(200).json({ message: 'Staff account updated successfully', staff: updatestaffData[0] });

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

// delete staff infromation logic (the Authority is only for the Admin)
router.delete('/staff', verifyToken, async (req, res) => {
    const { staff_id } = req.body;

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete staff accounts' });
    }

    if (!staff_id) {
        return res.status(400).json({ message: 'staff_id is required' });
    }

    try {
        const connection = await db.getConnection();
        try {
            const [staffData] = await connection.query(
                'DELETE FROM staff WHERE staff_id = ?',
                [staff_id]
            );

            if (staffData.affectedRows === 0) {
                return res.status(404).json({ message: 'Staff account not found' });
            }

            res.status(200).json({ message: 'Staff account deleted successfully' });
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