const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost/cinemaDB', 
).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

// Definir esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

// Configurar body-parser 
app.use(bodyParser.urlencoded({ extended: true }));

//Motor de plantillas EJS
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));


app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Registrar usuario
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send('Las contraseñas no coinciden');
    }

    try {
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send('Error al registrar usuario');
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.send('Correo o contraseña incorrectos');
        }

        res.redirect('/selectmovie'); // Redirige a selección de películas si el login es exitoso
    } catch (error) {
        console.log(error);
        res.send('Error al iniciar sesión');
    }
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