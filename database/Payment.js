const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
    reservation: { type: Schema.Types.ObjectId, ref: 'Reservation', required: true }, // Referencia a la reservación
    amount: { type: Number, required: true }, // Monto pagado
    paymentMethod: { type: String, required: true }, // Método de pago (tarjeta, PayPal, etc.)
    createdAt: { type: Date, default: Date.now } // Fecha del pago
});

module.exports = mongoose.model('Payment', PaymentSchema);
