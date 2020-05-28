const express = require('express')
const Task = require('../models/task')
const router = express.Router()

//
// CREATE
//
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
app.patch('/task/:id', async (req, res) => {
    const _id = req.params.id
    const args = req.body
    const allowedUpdates = ['completed', 'description']
    const isValid = Object.keys(args).every((arg) => allowedUpdates.includes(arg))

    if(!isValid) return res.status(400).send({error: "Invalid update."})

    try {
        const task = await Task.findByIdAndUpdate(_id, args, { new: true, runValidators: true })

        if(!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//
// DELETE
//
app.delete('/task/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete(_id)

        if(!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router