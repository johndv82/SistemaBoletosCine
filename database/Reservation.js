const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
    movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true }, // Referencia a la película
    seats: [{ type: String, required: true }], // Array de asientos seleccionados
    hour: {type: String, required: true}, // Hora seleccionada
    createdAt: { type: Date, default: Date.now } // Fecha de creación de la reserva
});

module.exports = mongoose.model('Reservation', ReservationSchema);
