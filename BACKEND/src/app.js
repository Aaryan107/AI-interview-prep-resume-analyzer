const express = require('express')

const app = express()

const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

const authRoutes = require('./routes/auth.routes')
const interviewRoutes = require('./routes/interview.routes')

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/interview',interviewRoutes)

module.exports = app