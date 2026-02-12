const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/elitesaloon')
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err, 'MongoDB connection error'));

//route for customer 
app.use('/customer', require('./routes/customerRoutes'));

   
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});