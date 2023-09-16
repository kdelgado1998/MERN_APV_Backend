import express from "express";
const router = express.Router();
import {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

router.route('/')//referencia a /api/pacientes
    .post(checkAuth, agregarPaciente)//envia un post a /api/pacientes
    .get(checkAuth, obtenerPacientes)//envia un get a /api/pacientes

router
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;