const express = require('express');
const router = express.Router();
const db = require('../db/db');


router.get('/course', async (req,res)=>{
    const course_id = req.query.course_id || req.body.course_id || req.params.course_id;

    const connection = await db.getConnection();

    if (course_id == '%'){
        const [courseData] = await connection.query(
            "SELECT * FROM course where course_id LIKE ?",
            [course_id]
        );
        
        if(courseData.length === 0){
            res.status(404).json({message: 'Not fount course data'})
        }

        res.status(200).json({
            message : 'course retrieved successfully', 
            course: courseData 
        });
    }
    else{
        const [courseData] = await connection.query(
            "SELECT * FROM course where course_id = ?",
            [course_id]
        );

        if(courseData.length === 0){
            res.status(404).json({message: 'Not fount course data'})
        }
    
        res.status(200).json({
            message : 'course retrieved successfully', 
            course: courseData 
        });
    }
});

router.post('/course', async (req,res)=>{
    const {course_name, credits, department_id} = req.body;
    
    const connection = await db.getConnection();
    
    const [courseData] = await connection.query(
        "INSERT INTO course (course_name, credits, department_id) VALUES (?,?,?)",
        [course_name, credits, department_id],
    );
    
    if(courseData.affectedRows === 0){
        res.status(401).json({message: 'Could not insert data'});
    }
    
    res.status(200).json({
        message : 'course inserted successfully',
    });
});
    
router.delete('/course', async (req,res)=>{
    const course_id = req.query.course_id || req.body.course_id || req.params.course_id;

    const connection = await db.getConnection();
    
    const [courseData] = await connection.query(
        "DELETE FROM course where course_id = ?",
        [course_id]
    );
    
    if(courseData.affectedRows === 0){
        res.status(401).json({ message: 'could not delete unfounded data'});
    }
    
    res.status(200).json({
        message : 'course inserted successfully',
    });
});
    
router.put('/course', async (req,res)=>{
    const course_id = req.query.course_id || req.body.course_id || req.params.course_id;

    const connection = await db.getConnection();

    const [courseData] = await connection.query(
        "UPDATE course SET course_name = ?, credits = ? , department_id = ? WHERE course_id = " + course_id ,
        [req.body.course_name,req.body.credits,req.body.department_id]
    );
    
    if (courseData.affectedRows === 0) {
        res.status(401).json({ message: 'could not delete unfounded data'});
    }    

    res.status(200).json({
        message : 'course updated successfully',
    });
});
    

module.exports = router;