const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({ name: 'string', 
         },
                { timestamps: { createDate: 'created_at', updatedDate: 'updated_at'}});

const Task = mongoose.model('todos', taskSchema);

module.exports = {
    Task
}