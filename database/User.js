const mongoose = require('mongoose');

// Definir esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
});

module.exports = mongoose.model('User', userSchema);