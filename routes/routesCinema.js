const express = require('express');
const router = express.Router();


router.get('/selectmovie', (req, res) => {
    res.render('select-movie.ejs');
});

router.get('/selectseat', (req, res) => {
    res.render('select-seats.ejs');
});

router.get('/confirm', (req, res) => {
    res.render('confirm-reservation.ejs');
});

module.exports = router;