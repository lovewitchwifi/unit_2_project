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

describe('test the todo endpoints', () => {
    test('it should create a new todo', async () => {
        const user = new User({
            name: "wolfie",
            email: "kitten@gmail.com",
            password: "mommy"
        })
        await user.save()
        const token = await user.generateAuthToken()
    
        const response = await request(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({ title: "feed me", completed: true })
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toEqual("feed me");
        expect(response.body.completed).toBe(true);
        expect(response.body.userEmail).toEqual("kitten@gmail.com");
      });
    })