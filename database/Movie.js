const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    banner: String,
    schedule: [String],  // Array con las horas disponibles
    date: String,        // Fecha de la película
    room: String         // Sala donde se proyecta la película
});

module.exports = mongoose.model('Movie', movieSchema);