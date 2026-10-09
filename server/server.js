const express = require('express');
const session = require('express-session');
const path = require('path');

const USUARIOS = require('./config/db').USUARIOS;

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/styles', express.static(path.join(__dirname, '../app/styles')));

// Configuración del middleware de sesiones
app.use(session({
    secret: 'clave_secreta_universidad',
    resave: false,
    saveUninitialized: false
}));

// Ruta raíz
app.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/home');
    }
    res.redirect('/login');
});

// Formulario de login
app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../app/views', 'login.html'));
});

// Procesar credenciales
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (USUARIOS[username] && USUARIOS[username] === password) {
        req.session.usuario = username;
        return res.redirect('/home');
    }

    res.status(401).send(`
        <script>
            alert('Usuario o contraseña incorrectos.');
            window.location.href = '/login';
        </script>
    `);
    
});

// Ruta protegida de Hola Mundo
app.get('/home', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    res.status(200).sendFile(path.join(__dirname, '../app/views', 'bienvenida.html'));
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});