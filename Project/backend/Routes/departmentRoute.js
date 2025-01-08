const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/department', async (req, res)=>{
    const {department_name, department_head } = req.body;

    if(!department_name || !department_head){
        return res.status(400).json({ message: 'Please fulfill all fields' });
    }

    const connection = await db.getConnection();

    const [newdepartment] = await connection.query(
        'INSERT INTO department(department_name, department_head) VALUES(?, ?)',
        [department_name, department_head]
    );

    if(newdepartment.length === 0){
        return res.status(500).json({ message: 'Error enter new department'});
    }

    res.status(200).json({ message: 'department created successfully', department: newdepartment[0] });
});

router.get('/department', async (req, res) => {
    const department_id = req.params.department_id || req.query.department_id || req.body.department_id;
    const connection = await db.getConnection();

    if(department_id && department_id !== '%'){
        const [departmentdata] = await connection.query(
            'SELECT * FROM department WHERE department_id = ?',
            [department_id]
        );
        
        if(departmentdata.length === 0){
            return res.status(404).json({message:`not found ${department_id}`})
        }

        res.status(200).json({ message: 'Successfully', department: departmentdata });
    } else {

        const [departmentdata]= await connection.query(
            'SELECT * FROM department'
        );
        
        if(departmentdata.length === 0){
            return res.status(404).json({message:`no department found`})
        }

        res.status(200).json({ message: 'Successfully', department: departmentdata });
    }
});


router.put('/department', async (req, res) =>{
    const { department_id, department_name, department_head } = req.body;

    if(!department_id || (!department_name && !department_head)){
        return res.status(400).json({ message: 'Please provide department_id and at least one field to update' });
    }

    const connection = await db.getConnection();

    let updateFields = [];
    let updateParams = [];

    if(department_name){
        updateFields.push('department_name = ?');
        updateParams.push(department_name);
    }
    if(department_head){
        updateFields.push('department_head = ?');
        updateParams.push(department_head);
    }
    updateParams.push(department_id);

    const updateQuery = `UPDATE department
                         SET ${updateFields.join(', ')}
                         WHERE department_id = ?`;
    
    const [newdepartmentData] = await connection.query(updateQuery, updateParams);

    if(newdepartmentData.affectedRows === 0){
        return res.status(400).json({ message: 'teacher not found' });
    }

    const [updatedDepartmentData] = await connection.query(
        'SELECT department_id, department_name, department_head FROM department WHERE department_id = ?',
        [department_id]
    );

    res.status(200).json({ message: 'department data updated successfully', department: updatedDepartmentData[0] });

});

router.delete('/department', async (req, res) => {
    const {department_id} = req.body;
    if (!department_id) {
        return res.status(400).json({ message: 'department_id is required' });
    }
    const connection = await db.getConnection();
    const [deleteResult] = await connection.query(
        'DELETE FROM department WHERE department_id = ?',
        [department_id]
    );

    if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'department account not found' });
    }

    res.status(200).json({ message: 'department account deleted successfully' });
     
});

module.exports = router;