import express from 'express';
import {
    registrar
    , perfil
    , confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//Area publica
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);//  /:Parametro dinamico
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword); lo de abajo son estas dos lineas en una
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//Area privada
router.get('/perfil', checkAuth, perfil);//cheamos primero que la autenticacion sea correcta y si lo es pasamos al siguiente funcion
router.put('/perfil/id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router;