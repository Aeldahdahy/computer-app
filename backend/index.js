const express = require('express');
const app = express();
const db = require('./db/db');
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware');
require('dotenv').config();
const bodyParser = require('body-parser');
const staffRoutes = require('./Routes/staffRoutes');
const studentRoutes = require('./Routes/studentRoutes');
const teacherRoutes = require('./Routes/teacherRoutes');
const departmentRoute = require('./Routes/departemntRoute');
const courseRoute = require('./Routes/courseRoute');
const classRoute = require('./Routes/classRoute');
const attendanceRoute = require('./Routes/attendence');
const class_studentRoute = require('./Routes/class_studentRoute');
const student_courseRoute = require('./Routes/student_courseRoute');
const teatcher_courseRoute = require('./Routes/teatcher_courseRoute');


app.use(cors());
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
app.use('/public', teatcher_courseRoute);

app.get('/public/search', async (req, res) => {
    const {table, column, value, sort} = req.query || req.body;

    console.log(table, column, value)

    if(!table || !column || !value){
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const connection = await db.getConnection();

    let query = `SELECT * FROM ?? WHERE ?? LIKE ?`;
    let values = [table, column, `%${value}%`];

    if(sort){
        query += `ORDER BY ??`;
        values.push(sort);
    }

    const [data] = await connection.query(query, values);

    if(data.length === 0){
        res.status(404).json({message: 'Data not found!'});
    }

    res.status(200).json({mesasge: 'Data:', data})
});

app.post('/public/logout', verifyToken, async(req, res) => {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.get('/public', (req, res)=>{
    res.status(200).json({ mesasge: `server is running at port ${PORT}`});
});

const PORT = process.env.PORT;
app.listen(PORT, console.log(`server is running at port ${PORT}`));