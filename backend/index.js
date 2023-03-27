const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const pinRoute = require('./routes/pins.js')
const userRoute = require('./routes/users.js')
const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('MongoDB is connected!');
}).catch(e => console.log(e))

app.use('/api/pins', pinRoute);
app.use('/api/users', userRoute);

app.listen(8800, () => {
    console.log('Backend server is running!');
})