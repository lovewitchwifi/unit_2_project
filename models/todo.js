const { model, Schema } = require('mongoose')

const todoSchema = new Schema ({
    title: { type: String, required: true },
    category: { type: String, required: false },
    priority: { type: String, required: false },
    progress: { type: Boolean, required: false },
    completed: { type: Boolean, required: false },
    user: { type: Schema.Types.ObjectId, required: false, ref: 'User' }
}, {
    timestamps: true
})

const Todo = model('Todo', todoSchema)

module.exports = Todo