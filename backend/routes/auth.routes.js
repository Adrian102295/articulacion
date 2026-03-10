/**
 * Rutas de autenticacion
 * define los endpoints para registro login y gestion de perfil
 */


//importar router de express
const express = require('express');
const router = express.Router();

//importar controladores
const {
    registrar,
    login,
    getMe,
    updateMe,
    changePassword,
} = require('../controllers/auth.controller');

//importar middlewares
const { verificarAuth } = require('../middleware/auth');

//Rutas publicas

router.post('/register', registrar);

router.post('/login', login);

//Rutas protegidas

router.get('/me', verificarAuth, getMe);

router.put('/me', verificarAuth, updateMe);

router.put('/me/password', verificarAuth, changePassword);

//exportar router
module.exports = router;