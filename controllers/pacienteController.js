import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    // console.log(req.body);
    const paciente = new Paciente(req.body);
    // console.log(paciente);

    // console.log(req.veterinario._id)
    paciente.veterinario = req.veterinario._id;

    try {
        // console.log(paciente)
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};
const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
    // console.log(req.params.id);
    const { id } = req.params;
    const paciente = await Paciente.findById(id);


    // console.log(paciente.veterinario._id)
    // console.log(req.veterinario._id)

    // console.log(paciente);
    //Vamos a revisar que la peticion sea echa por el 
    // veterinario autenticado

    if (!paciente) {
        return res.status(404).json({ msg: 'No encontrado' })
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Accion no valida!!' });
    }

    res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({ msg: 'No encontrado' })
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Accion no valida!!' });
    }


    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    // console.log(paciente)
    if (!paciente) {
        return res.status(404).json({ msg: 'No encontrado' })
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Accion no valida!!' });
    }

    try {
        await paciente.deleteOne();//esta funcion esta en la documentacion de mongoose
        res.json({msg: "Paciente Eliminado!!"})
    } catch (error) {
        console.log(error);
    }
};

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};