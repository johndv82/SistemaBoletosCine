const Movie = require('../database/Movie');
const Reservation = require('../database/Reservation');
const User = require('../database/User');

// Exportamos una función que recibe el servidor de Socket.IO
module.exports = function (io) {
    io.on('connection', async (socket) => {
        console.log('Usuario conectado');

        socket.on('getSeatCount', async ({ movieTitle, hour }) => {
            const movie = await Movie.findOne({ title: movieTitle });
            try {
                const reservations = await Reservation.find({ movie, hour });
                // Contar todos los asientos reservados sumando los arrays de "seats" de todas las reservaciones
                const seatsCount = reservations.reduce((total, reservation) => {
                    return total + reservation.seats.length;
                }, 0);

                socket.emit('seatCount', {
                    id: movie._id,
                    count: 60 - seatsCount
                });
            } catch (error) {
                console.error('Error al obtener el conteo de asientos:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
};