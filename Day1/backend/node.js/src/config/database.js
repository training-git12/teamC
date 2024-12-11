const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/teamC'; 

mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });