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
const socketHandler = require('./sockets/socketHandler'); // Importa el manejador de sockets


app.use(session({
    secret: '12345',  // Cambia esto por una clave secreta real
    resave: true,
    saveUninitialized: true
}));


// Configurar body-parser 
app.use(bodyParser.urlencoded({ extended: true }));

//Motor de plantillas EJS
app.set('view engine', 'ejs');
//Configuración carpeta public
app.use(express.static('public'));
//Configuración node_modules
app.use(express.static(path.join(__dirname, "node_modules/")));
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist/')));

app.use((req, res, next) => {
    req.io = io;  // Poner `io` disponible en las rutas
    next();
});

// Rutas
app.use(routesUser);
app.use(routesCinema);

// Manejar la lógica de Socket.IO en otro archivo
socketHandler(io);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
