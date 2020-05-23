const express = require('express')
require('./db/mongoose')
const User = require('./models/user')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // Parse incoming json to obj.

app.post('/index', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.listen(port, () => {
    console.log("Server is on port " + port)
})