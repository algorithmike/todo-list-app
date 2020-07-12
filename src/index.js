const express = require('express')
require('./db/mongoose')
const auth = require('./middleware/auth')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')


const app = express()
const port = process.env.PORT
app.use(express.json()) // Parse incoming json to obj.
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server is on port " + port)
}) 