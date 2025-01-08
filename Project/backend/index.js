const express = require('express');
const app = express();
const db = require('./db/db');
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware');
const { addToBlacklist, isBlacklisted } = require('./middleware/tokenBlacklist');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require('body-parser');
const staffRoutes = require('./Routes/staffRoutes');
const studentRoutes = require('./Routes/studentRoutes');
const teacherRoutes = require('./Routes/teacherRoutes');
const departmentRoute = require('./Routes/departmentRoute');
const courseRoute = require('./Routes/courseRoute');
const classRoute = require('./Routes/classRoute');
const attendanceRoute = require('./Routes/attendanceRoute');
const class_studentRoute = require('./Routes/class_studentRoute');
const student_courseRoute = require('./Routes/student_courseRoute');
const teacher_courseRoute = require('./Routes/teacher_courseRoute');

app.use(cors({
    origin: 'http://localhost:9200',
    server: 'http://localhost:27879',
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));
app.use(bodyParser.json());
app.use('/public', staffRoutes);
app.use('/public', studentRoutes);
app.use('/public', teacherRoutes);
app.use('/public', departmentRoute);
app.use('/public', courseRoute);
app.use('/public', classRoute);
app.use('/public', attendanceRoute);
app.use('/public', class_studentRoute);
app.use('/public', student_courseRoute);
app.use('/public', teacher_courseRoute);

app.get('/public/search', async (req, res) => {
    const { table, columns, value, sort } = req.query || req.body;

    if (!table || !columns || !value) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const connection = await db.getConnection();

        const columnArray = columns.split(',');
        const conditions = columnArray.map(column => `?? LIKE ?`).join(' OR ');
        const values = columnArray.flatMap(column => [column, `%${value}%`]);

        let query = `SELECT * FROM ?? WHERE (${conditions})`;
        values.unshift(table);

        if (sort) {
            query += ` ORDER BY ??`;
            values.push(sort);
        }

        const [data] = await connection.query(query, values);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Data not found!' });
        }

        res.status(200).json({ message: 'Data retrieved successfully', data });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error. Unable to retrieve data.' });
    }
});

app.post('/public/logout', verifyToken, async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        addToBlacklist(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.post('/public/verifyToken', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'Token is required.' });
    }

    if (isBlacklisted(token)) {
        console.error('Token is blacklisted');
        return res.status(401).json({ message: 'Token is blacklisted.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token is valid:', decoded);
        return res.status(200).json({ message: 'Token is valid.', user: decoded });
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        return res.status(400).json({ message: 'Invalid token.' });
    }
});

// Error handling for unhandled exceptions and promise rejections
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optionally, you can exit the process if needed
    // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, you can exit the process if needed
    // process.exit(1);
});

const PORT = process.env.PORT || 27879; // Default port fallback
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));