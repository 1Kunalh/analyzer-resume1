const express = require('express')
const app = express()
const fileupload = require('express-fileupload')
const cors = require('cors')

require('dotenv').config()
app.use(cors())
app.use(fileupload())

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

const analyze = require('./routes/analyze.js')
app.use('/api',analyze)

app.use('/', (req, res) => { 
    res.send('<h1>Server is running!</h1>')
})