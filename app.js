const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar body-parser para manejar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

//Motor de plantillas EJS
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));


app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.get('/selectmovie', (req, res) => {
    res.render('select-movie.ejs');
});

app.get('/selectseat', (req, res) => {
    res.render('select-seats.ejs');
});

app.get('/confirm', (req, res) => {
    res.render('confirm-reservation.ejs');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));