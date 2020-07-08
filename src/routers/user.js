const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const uploadPic = require('../middleware/uploadPic')
const { sendWelcome, sendGoodbye } = require('../emails/account')
const router = express.Router()

// Create new user
router.post('/index', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcome(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// Logout / Clear all user's tokens if signed in on multiple devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Retrieve user's own profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Retrieve profile picture of user
router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// Update user's own profile
router.patch('/user/me', auth, async (req, res) => {
    const _id = req.user.id
    const args = req.body
    const updates = Object.keys(args)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValid = updates.every((arg) => allowedUpdates.includes(arg))

    if(!isValid) return res.status(400).send({error: "Invalid update."})

    try {
        updates.forEach((update) => req.user[update] = args[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Add a profile picture to profile
router.post('/user/me/avatar', auth, uploadPic(), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
                            .resize(300, 300,{fit: 'inside'})
                            .png()
                            .toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

// Delete user's own profile picture
router.delete('/user/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined

        await req.user.save()
        res.send(req.user)
        const _id = req.user._id
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete user's own profile
router.delete('/user/me', auth, async (req, res) => {
    const _id = req.user._id

    try {
        req.user.remove()
        sendGoodbye(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router