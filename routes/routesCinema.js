const express = require('express');
const router = express.Router();
const Movie = require('../database/Movie');

let movie_select = {
    pelicula: '',
    horario: '',
    fecha: '',
    sala: '',
    asientos: [],
    total_price: 0
};

router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find(); // Obteniendo las películas de MongoDB
        res.render('select-movie', { movies });
    } catch (error) {
        res.status(500).send("Error obteniendo las películas");
    }
});

router.post('/seats', (req, res) => {
    const { pelicula, horario, fecha, sala } = req.body;
    movie_select = { ...movie_select, pelicula, horario, fecha, sala };
    res.render('select-seats', movie_select);
});

router.post('/reservation', (req, res) => {
    const selectedSeats = req.body.selectedSeats.split(',');
    const total = req.body.totalPrice;
    movie_select.asientos = selectedSeats;
    movie_select.total_price = total;
    res.render('confirm-reservation', movie_select);
});

router.post('/complete-reservation', (req, res) => {
    res.redirect('movies');
});



module.exports = router;