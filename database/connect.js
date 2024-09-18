// Conexión a MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const dbURI = process.env.DB_URI;


mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

module.exports = mongoose;