const express = require('express');
const Task = require('../models/task');
const router = new express.Router()

router.post('/task', (req, res)=>{
    const task = new Task(req.body);
    task.save().then((data)=>{
        res.send(201).send(data);
    }).catch(()=>{
        res.status(400).send();
    })
})



router.get('/tasks', (req,res)=>{
    Task.find({}).then((data)=>{
        res.send(data)
    }).catch(()=>{
        res.sataus(500).send()
    })
})

router.get('/tasks/:id', (req,res)=>{
    const id = req.params.id;
   // console.log(id);
    Task.findById(id).then((data)=>{
        if(!data){
            res.status(404).send()
        }
        res.send(data)
    }).catch((e)=>{
    //    console.log(e)
        res.sataus(500).send()
    });
});

module.exports = router