import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        //el string sale de la pagina de mongo,la opcion que menciona driver
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        //Imprimir mensaje de error
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default conectarDB;