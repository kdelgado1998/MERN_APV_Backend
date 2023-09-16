import emailRegistro from "../helpers/emailRegistro.js";
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {//URL general de veterinarios
    // res.send('Desde API/Veterinarios') Debug

    // console.log(req.body);//Est es el body que viene de postman
    // const { email, password, nombre } =  req.body;
    // console.log(email);
    // console.log(password);
    // console.log(nombre);

    //Revisar si un usuario ya esta registrado, lo haremos por medio del email porque en teroria lo definimos como unico
    const { email, nombre } = req.body;

    const existeUsuario = await Veterinario.findOne({ email }); // permite buscar por los diferentes atributos de cada uno de los registros

    if (existeUsuario) {
        // console.log(existeUsuario);
        const error = new Error('Usuario ya registrado!!');
        return res.status(400).json({ msg: error.message });
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();//viene de mongoose es para guardar en la DB

        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json({ veterinarioGuardado });
    } catch (error) {
        console.log(error);
    }

};

const perfil = (req, res) => {//login de veterinarios
    // console.log(req.veterinario)
    // res.json({ msg: 'Mostrando Perfil' });

    const { veterinario } = req;
    res.json({ veterinario });
};

const confirmar = async (req, res) => {//login de veterinarios
    // console.log(req.params.token);//togen dinamico desde el router

    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });//si la llave y el valor es el misno puede ir asi, en este caso es la variable de arriba token : token entonces puede ir una sola vez
    // console.log(usuarioConfirmar);

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido!!');
        return res.status(400).json({ msg: error.message });
    }

    // console.log(usuarioConfirmar);

    try {

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({ msg: 'Usuario confirmado correctamente!!' });
    } catch (error) {
        console.log(error);
    }

};

const autenticar = async (req, res) => {
    // console.log(req.body);

    //Comprobar si el usuario existe
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({ email });

    // if (usuario) { Esta es una forma
    //     console.log('Si existe');
    //     res.json({ msg: "Autenticando..." });
    // } else {
    //     res.status(403).json({ msg: 'El usuario no exixte' });
    // }

    //Comprobar si el usuario existe en la DB
    if (!usuario) {
        const error = new Error('El usuario no existe!!');
        return res.status(404).json({ msg: error.message });
    }

    //Comprobar si el usuario esta confirmado o no
    if (!usuario.confirmado) {//si no esta confirmado
        const error = new Error('Tu cuenta no ha sido confirmada!!');
        return res.status(403).json({ msg: error.message });
    }

    //Revisar el password
    if (await usuario.comprobarPassword(password)) {
        // console.log('Password correcto');
        //Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        // console.log('Password incorrecto');
        const error = new Error('El password no existe!!');
        return res.status(404).json({ msg: error.message });
    }



};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    // console.log(email);

    const existeVerterinario = await Veterinario.findOne({ email });
    if (!existeVerterinario) {
        const error = new Error('El usuario no existe!!');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVerterinario.token = generarId();// le genera un id en caso de que si exista
        await existeVerterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVerterinario.nombre,
            token: existeVerterinario.token
        })



        res.json({ msg: "Hemos enviado un email con las instrucciones!!" });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    // console.log(token)

    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        //El token es valido entonces el usuario existe
        res.json({ msg: "Token Valido el usuario si existe!!" });
    } else {
        const error = new Error('Token no valido!!');
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {

    const { token } = req.params;//params es url
    const { password } = req.body;//Lo que se escribe en el body de un formulario

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        // console.log(veterinario);
        await veterinario.save();
        res.json({ msg: "Password modificado correctamente!!" });
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body);

    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body

    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email })
        if (existeEmail) {
            const error = new Error('Ese emial ya está en uso')
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    // console.log(req.veterinario)
    // console.log(req.body)

    //Leer datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body

    //comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }
    //comprobar el password

    if(await veterinario.comprobarPassword(pwd_actual)){
        //almacenar el nuevo password

        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password Almacenado Correctamente'})
    }else{
        const error = new Error('Verifica tu password');
        return res.status(400).json({ msg: error.message });
    }

    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};
