import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {//en caso de que no encuentra el perfil el next detiene la ejecucion del codigo y lo pasa al siguiente middleware
    // console.log('Desde mi middleware');
    // console.log(req.headers.authorization);

    let token;

    if (req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer')) {
        // console.log('Si tiene el token con bearer')

        try {
            token = req.headers.authorization.split(" ")[1];//Esto regresa este token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJLZXlsb3IiLCJpYXQiOjE2OTEzNjE5MTksImV4cCI6MTY5Mzk1MzkxOX0.LqN_egcp9FpYtBSG4_EwQlgb8VWjPKXXBLPhyUji4A4, split corta el espacio entre el bearer y el toekn y lo regresa como un arreglo por lo que ocupamos la poscion del token
            // console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);

            req.veterinario = await Veterinario.findById(decoded.id).select(
                "-password -token -confirmado"
            );
            // console.log(veterinario)
            return next();
        } catch (error) {
            const e = new Error('Token no valido o inexistente!!');
            return res.status(403).json({ msg: e.message });
        }
    }

    if(!token){
        const error = new Error('Token no valido o inexistente!!');
        res.status(403).json({ msg: error.message });
    }

    next();
}

export default checkAuth;