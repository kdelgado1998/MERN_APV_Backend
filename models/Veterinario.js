import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false,
    }
});

//Vamos a hashear el password
veterinarioSchema.pre('save', async function(next){
    // console.log(this);
    if(!this.isModified('password')){
        next();//esto es por si ya esta hasheado que no lo vuelva a hashear
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});//pre save = antes de guardarlo en la db

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);//el segundo es el password del req y res
}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;

