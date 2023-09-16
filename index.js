// console.log('Desde node JS')
import express from "express";
import dotenv from 'dotenv';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import cors from 'cors';

const app = express(); //toda la funcionalidad de express
app.use(express.json());// Esto es para que lea las solicitudes de POST man en formato JSON, sin esto salen como Undefined

dotenv.config();
conectarDB();
// console.log(process.env.MONGO_URI);

const dominiosPermitidos = ["http://localhost:5173", "http://localhost:4000"];

const corsOpctions = {
    origin: function(origin, callBack){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del request esta permitido
            callBack(null, true);
        }else{
            callBack(new Error('No permitido por CORS'));
        }
    }
}
app.use(cors(corsOpctions));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000; //Si no existe la variable aplicale el puerto 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});



