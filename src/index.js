const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // Parse incoming json to obj.

//
// CREATE
//
app.post('/index', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/task', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//
// READ
//
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})

        if(!users) return res.status(404).send()
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/user/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if(!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({})

    try {
        if(!tasks) return res.status(404).send()
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/task/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)

        if(!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//
// UPDATE
//
app.patch('/user/:id', async (req, res) => {
    const _id = req.params.id
    const args = req.body
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValid = Object.keys(args).every((arg) => allowedUpdates.includes(arg))

    if(!isValid) return res.status(400).send({error: "Invalid update."})

    try {
        const user = await User.findByIdAndUpdate(_id, args, { new: true, runValidators: true })

        if(!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.listen(port, () => {
    console.log("Server is on port " + port)
})