const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(3000)
const User = require('../models/user')
const Todo = require('../models/todo')
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.connect.close()
    mongoServer.stop()
    server.close()
})

describe('test user endpoints', () => {
    test('it should create a new user', async () => {
        const response = await request(app).post('/users').send({
            name: "luca",
            email: "luca@gmail.com",
            password: "test"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual("luca")
        expect(response.body.user.email).toEqual("luca@gmail.com")
        expect(response.body).toHaveProperty("token")
    })

    test('it should allow a user to login', async() => {
        const user = new User({ 
            name: "luca", 
            email: "luca1@gmail.com", 
            password: "test" 
        })
        await user.save()
        const response = await request(app)
            .post('/users/login')
            .send({ email: user.email, password: 'test' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.email).toEqual('luca1@gmail.com')
        expect(response.body.user.name).toEqual('luca')
        expect(response.body).toHaveProperty('token')
    })

    test('it should update a user', async () => {
        const user = new User({ 
            name: "DW", 
            email: "dw@gmail.com", 
            password: "arthur" 
        })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "queen DW", email: "queendw@gmail.com"})

        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('queen DW')
        expect(response.body.email).toEqual('queendw@gmail.com')
    })

    test('it should delete a user', async () => {
        const user = new User({
          name: "wolf",
          email: "wolf@gmail.com",
          password: "mom",
        })
        await user.save()
        const token = await user.generateAuthToken()
    
        const response = await request(app)
          .delete(`/users/${user._id}`)
          .set("Authorization", `Bearer ${token}`)
    
        expect(response.statusCode).toBe(200)
      })


      describe('test the todos endpoints', () => {
        test('it should create a new todo', async () => {
            const user = new User({
                name: "meow",
                email: "meow@gmail.com",
                password: "bad",
                progress: "started",
                category: "chill",
                priority: "top"
            })
            await user.save()
            const token = await user.generateAuthToken()
        
            const response = await request(app)
              .post("/todos")
              .set("Authorization", `Bearer ${token}`)
              .send({ title: "sleep", completed: true })
    
            expect(response.statusCode).toBe(200)
            expect(response.body.title).toEqual("sleep")
            expect(response.body.completed).toBe(true)
            expect(response.body.userEmail).toEqual("meow@gmail.com")
          })

        test('It should show users todos', async () => {
            const user = new User({
              name: "romeo",
              email: "romeo@gmail.com",
              password: "love",
              progress: "complete",
              category: "fun",
              priority: "top"
            })
        
            await user.save()
            const token = await user.generateAuthToken()
        
            const todo = new Todo({
              title: "play",
              userEmail: "romeo@gmail.com",
              completed: true,
              priority: "top"
            })
            await todo.save()

            Todo.find = jest.fn().mockResolvedValue(todo)

            const response = await request(app)
                .get("/todos/user/" + user._id.toString())
                .set("Authorization", `Bearer ${token}`)
    
            expect(response.status).toBe(200)
            expect(response.body.title).toEqual(todo.title)
            expect(response.body.completed).toEqual(todo.completed)
            expect(response.body.priority).toEqual(todo.priority);
            expect(response.body.userEmail).toEqual(todo.userEmail)    
        })
    
        test('It should update an existing todo', async () => {
            const user = new User({
                name: "keem",
                email: "keem@gmail.com",
                password: "baby"
            })
    
            await user.save()
            const token = await user.generateAuthToken()
    
            const todo = new Todo({
                title: "phone",
                userEmail: "keem@gmail.com",
                completed: false,
                priority: "medium"
            })
            await todo.save()
    
            const updatedTodo = {
                title: "phone",
                completed: true
            }
    
            const response = await request(app)
                .put(`/todos/${todo._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedTodo)
    
            expect(response.status).toBe(200)
            expect(response.body.title).toEqual(updatedTodo.title)
            expect(response.body.completed).toEqual(updatedTodo.completed)
            expect(response.body.userEmail).toEqual(todo.userEmail)
        })
    
        test('It should delete an existing todo', async () => {
            const user = new User({
                name: "tentacion",
                email: "tentacion@gmail.com",
                password: "x"
            })
    
            await user.save()
            const token = await user.generateAuthToken()
    
            const todo = new Todo({
                title: "drive",
                userEmail: "tentacion@gmail.com",
                completed: false,
                priority: "low"
            })
            await todo.save()
    
            const response = await request(app)
                .delete('/todos/' + todo._id.toString())
                .set("Authorization", `Bearer ${token}`)
    
            expect(response.status).toBe(204)
    
            const deletedTodo = await Todo.findById(todo._id)
            expect(deletedTodo).toBeNull()
        })
    })
})