const { model, Schema } = require('mongoose')

const todoSchema = new Schema ({
    title: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    progress: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
}, {
    timestamps: true
})

const Todo = model('Todo', todoSchema)

module.exports = Todo