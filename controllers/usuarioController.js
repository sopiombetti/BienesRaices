import {check, validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"
import { generarJWT, generarId } from '../helpers/tokens.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage('El Email debe tener un formato correcto').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado esté vacío
    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: resultado.array(),
        })
    }

    const {email, password} = req.body

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: [{msg: "El usuario no existe"}]
        })
    }

    //Comprobar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: [{msg: "La contraseña es incorrecta"}]
        })
    }

    //Autenticar al usuario
    const token = generarJWT(usuario.id)

    //Almacenar en una cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')

}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('El Nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El Email debe tener un formato correcto').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('Las contraseñas deben coincidir').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado esté vacío
    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //Extraer datos
    const {nombre, email, password} = req.body

    //Verificar que el usuario no esté duplicado
    const existeUsuario = await Usuario.findOne({where: {email}})

    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya está registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //Almacenar un usuario
    await Usuario.create({
        nombre, 
        email, 
        password,
        token: generarId()
    })

    //Mostrar mensaje de confirmación
    res.render('template/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Ya puedes iniciar sesión'
    })

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}