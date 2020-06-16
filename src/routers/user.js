const express = require('express')
const User = require('../models/user')
const router = express.Router()

//
// CREATE
//
router.post('/index', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//
// READ
//
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})

        if(!users) return res.status(404).send()
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/user/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if(!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//
// UPDATE
//
router.patch('/user/:id', async (req, res) => {
    const _id = req.params.id
    const args = req.body
    const updates = Object.keys(args)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValid = updates.every((arg) => allowedUpdates.includes(arg))

    if(!isValid) return res.status(400).send({error: "Invalid update."})

    try {
        const user = await User.findByIdAndUpdate(_id)
        updates.forEach((update) => user[update] = args[update])
        await user.save()

        if(!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//
// DELETE
//
router.delete('/user/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findByIdAndDelete(_id)

        if(!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router