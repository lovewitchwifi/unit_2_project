const express = require('express')
const router = express.Router()
const todoCtrl = require('../controllers/todos')


// Index /todos
router.get('/notcompleted', todoCtrl.indexNotComplete)

// Index /todos/completed
router.get('/completed', todoCtrl.indexComplete)

// Delete /todos/:id
router.delete('/:id', todoCtrl.delete)

// Update /todos/:id
router.put('/:id', todoCtrl.update)

// Create /todos
router.post('/', todoCtrl.create)

// Show /todos/:id
router.get('/user/:id', todoCtrl.show)

module.exports = router 