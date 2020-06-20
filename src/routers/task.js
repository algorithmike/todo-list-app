const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

//
// CREATE
//
router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

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
router.get('/tasks', async (req, res) => {
    const tasks = await Task.find({})

    try {
        if(!tasks) return res.status(404).send()
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/task/:id', async (req, res) => {
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
router.patch('/task/:id', async (req, res) => {
    const _id = req.params.id
    const args = req.body
    const allowedUpdates = ['completed', 'description']
    const updates = Object.keys(args)
    const isValid = updates.every((arg) => allowedUpdates.includes(arg))

    if(!isValid) return res.status(400).send({error: "Invalid update."})

    try {
        const task = await Task.findByIdAndUpdate(_id)
        updates.forEach((update) => task[update] = args[update])
        await task.save()

        if(!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//
// DELETE
//
router.delete('/task/:id', async (req, res) => {
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