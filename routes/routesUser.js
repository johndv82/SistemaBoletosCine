const express = require('express');
const router = express.Router();
const User = require('../database/User');
const bcrypt = require('bcryptjs');

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
        // Generar el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send('Error al registrar usuario');
    }
});

/// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.send('Correo o contraseña incorrectos');
        }

        // Comparar la contraseña ingresada con el hash almacenado
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('Correo o contraseña incorrectos');
        }

        // Si las contraseñas coinciden, redirigir a la selección de películas
        res.redirect('/movies');
    } catch (error) {
        console.log(error);
        res.send('Error al iniciar sesión');
    }
});

module.exports = router;