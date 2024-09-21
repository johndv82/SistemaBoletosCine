const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const routesUser = require('./routes/routesUser');
const routesCinema = require('./routes/routesCinema');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require('dotenv').config();
const mongoose = require('./database/connect');  // Conexión a MongoDB

app.use(session({
    secret: 'your_secret_key',  // Cambia esto por una clave secreta real
    resave: false,
    saveUninitialized: false
}));

// Configurar body-parser 
app.use(bodyParser.urlencoded({ extended: true }));

//Motor de plantillas EJS
app.set('view engine', 'ejs');
//Configuración carpeta public
app.use(express.static('public'));
//Configuración node_modules
app.use(express.static(path.join(__dirname, "node_modules/")));

// Rutas
app.use(routesUser);
app.use(routesCinema);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});