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
app.post('/index', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.post('/task', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

//
// READ
//
app.get('/users', (req, res) => {
    User.find({}).then((result) => {
        res.send(result)
    }).catch(() => {
        res.status(500).send()
    })
})

app.get('/user/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((result) => {
        if(!result) return res.status(404).send()

        res.send(result)
    }).catch((() => {
        res.status(500).send()
    }))
})

app.get('/tasks',(req, res) => {
    Task.find({}).then((result) => {
        res.send(result)
    }).catch(() => {
        res.status(500).send()
    })
})

app.get('/task/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((result) => {
        if(!result) return res.status(404).send()

        res.send(result)
    }).catch(() => {
        res.status(500).send()
    })
})


app.listen(port, () => {
    console.log("Server is on port " + port)
})