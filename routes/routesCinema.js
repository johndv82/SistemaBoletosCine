const express = require('express');
const router = express.Router();
const Movie = require('../database/Movie');

router.get('/selectseat', (req, res) => {
    res.render('select-seats.ejs');
});

router.get('/confirm', (req, res) => {
    res.render('confirm-reservation.ejs');
});

router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find(); // Obteniendo las películas de MongoDB
        res.render('select-movie', { movies });
    } catch (error) {
        res.status(500).send("Error obteniendo las películas");
    }
});

router.post('/reservar', (req, res) => {
    const { pelicula, horario, fecha, sala } = req.body;
    // Aquí se manejaría la lógica para procesar la reserva
    res.send(`Has reservado la película "${pelicula}" para el ${fecha} en la ${sala} a las ${horario}.`);
});

module.exports = router;