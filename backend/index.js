const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const pinRoute = require('./routes/pins.js')
const userRoute = require('./routes/users.js')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use(express.static('public'))

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}


app.use('/api/pins', pinRoute);
app.use('/api/users', userRoute);

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
