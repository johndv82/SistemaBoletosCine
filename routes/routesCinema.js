const express = require('express');
const router = express.Router();
const Movie = require('../database/Movie');
const Reservation = require('../database/Reservation');
const Payment = require('../database/Payment');
const User = require('../database/User');

let movie_select = {
    pelicula: '',
    hora: '',
    fecha: '',
    sala: '',
    asientos: [],
    total_price: 0,
    asientos_reservados: []
};

router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find(); // Obteniendo las películas de MongoDB
        res.render('select-movie', { movies });
    } catch (error) {
        res.status(500).send("Error obteniendo las películas");
    }
});

router.post('/seats', async (req, res) => {
    const { pelicula, hora, fecha, sala } = req.body;
    movie_select = { ...movie_select, pelicula, hora, fecha, sala };
    try {
        const movie = await Movie.findOne({ title: movie_select.pelicula });
        const reservaciones = await Reservation.find({
            movie: movie,
            hour: hora 
        });
        movie_select.asientos_reservados = reservaciones.map(reservacion => reservacion.seats).flat();
        res.render('select-seats', movie_select);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los asientos reservados');
    }

});

router.post('/reservation', (req, res) => {
    const selectedSeats = req.body.selectedSeats.split(',');
    const total = req.body.totalPrice;
    movie_select.asientos = selectedSeats;
    movie_select.total_price = total;
    movie_select.estado = 'Confirm';
    res.render('confirm-reservation', movie_select);
});

router.post('/complete-reservation', async (req, res) => {
    //Guardar Reservación
    const user = await User.findOne({ email: 'ydenos@mail.com' });
    const movie = await Movie.findOne({ title: movie_select.pelicula });
    let idUsuario = user._id; //req.UserId;

    try {

        // Crear la reservación
        const newReservation = new Reservation({
            user: idUsuario,
            movie: movie._id,
            seats: movie_select.asientos,
            hour: movie_select.hora
        });
        const savedReservation = await newReservation.save();

        // Crear el pago
        const newPayment = new Payment({
            user: idUsuario,
            reservation: savedReservation._id,
            amount: movie_select.total_price,
            paymentMethod: req.body.payment
        });
        await newPayment.save();
        movie_select.estado = 'Reserved';
        movie_select.mensaje = 'Reserva de entrada(s) finalizada con éxito. Puedes ver sus reservas aquí: <a href="/reservations">Mis Compras</a>.';
        res.render('confirm-reservation', movie_select);
    } catch (error) {
        console.error('Reservación abortada, error al registrar:', error);
    }
});

router.get('/reservations', async (req, res) => {
    try {
        const user = await User.findOne({ email: 'ydenos@mail.com' });
        const userId = user._id; //req.UserId;

        // 1. Buscar todas las reservaciones del usuario
        const reservations = await Reservation.find({ user: userId }).populate('movie').exec();

        // 2. Generar el array de compras con la información de las películas y pagos
        const compras = await Promise.all(reservations.map(async (reservation) => {
            const movie = await Movie.findOne({title: reservation.movie.title}).exec();
            const payment = await Payment.findOne({ reservation: reservation._id }).exec();

            return {
                movie: {
                    title: movie.title,
                    imageURL: movie.banner,
                    room: movie.room,
                    hour: reservation.hour,
                    date: movie.date
                },
                seats: reservation.seats,
                payment: {
                    method: payment.paymentMethod,
                    total: payment.amount
                },
                reservationId: reservation._id
            };
        }));
        res.render('my-reservations', {compras});
    } catch (error) {
        res.status(500).send("Error obteniendo las Compras");
    }
});



module.exports = router;