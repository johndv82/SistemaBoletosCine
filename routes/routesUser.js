const express = require('express');
const router = express.Router();
const User = require('../database/User');

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

// Registrar usuario
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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

module.exports = router;