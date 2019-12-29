const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',
                    {useNewUrlParser: true, useCreateIndex: true})




    
// const myTask = new Task({description: 'my Desc', completed:false});
// myTask.save().then(()=>{
//     console.log(myTask);
// }).catch(()=>{
// console.log('Task Save failed..');
// })