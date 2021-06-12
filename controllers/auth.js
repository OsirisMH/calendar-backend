const { response } = require('express');
const bcrypt = require('bcryptjs');

const UserModel = require('../models/UserModel');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try{
        let user = await UserModel.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está en uso'
            });
        }
        user = new UserModel( req.body );

        // Encriptar constraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();
         
        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const userLogin = async (req, res = response) => {
    const { email, password } = req.body;
    try{
        const user = await UserModel.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y/o contrseña incorrectos'
            });
        }

        // Confirmar las contraseñas
        const validPassword = bcrypt.compareSync( password, user.password);
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y/o contrseña incorrectos'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        return res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req;
    
    // Generar un nuevo JWT y retornarlo en este petición
    const token = await generateJWT( uid, name );

    return res.json({
        ok: true,
        token
    });
};

module.exports = {
    createUser,
    userLogin,
    revalidateToken
};