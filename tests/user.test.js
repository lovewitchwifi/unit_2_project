const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(8080, () => console.log('lets test this b'))
const User = require('../models/user')
const { describe } = require('node:test')
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.connect.close
    mongoServer.stop()
    server.close
})

describe("test user endpoints", () => {
    test("it should create a new user", async () => {
        const response = await request(app).post("/users").send({
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
            name: 'luca', 
            email: 'luca1@gmail.com', 
            password: 'test' })
        await user.save()
        const response = await request(app)
            .post('/users/login')
            .send({ email: user.email, password: 'test' })
            console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.user.email).toEqual('luca1@gmail.com')
        expect(response.body.user.name).toEqual('luca')
        expect(response.body).toHaveProperty('token')
    })
    test('it should update a user', async () => {
        const user = new User({ 
            name: 'DW', 
            email: 'dw@gmail.com', 
            password: 'arthur' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'queen DW', email: 'queendw@gmail.com'})

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
})