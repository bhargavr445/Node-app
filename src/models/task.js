
const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {type:String},
    completed: {type: Boolean}
})

module.exports = Task