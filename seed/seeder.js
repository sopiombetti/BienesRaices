import { exit } from 'node:process'
import categorias from "./categorias.js";
import precios from './precios.js';
import { Categoria, Precio } from '../models/index.js'
import db from "../config/db.js";

const importarDatos = async () => {
    try{
        //Autenticar
        await db.authenticate()
        //Generar las columnas
        await db.sync()
        //Importar los datos
        await Categoria.bulkCreate(categorias)
        await Precio.bulkCreate(precios)

        console.log('datos importados')
        exit()
    }
    catch(error){
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try{
        // await Categoria.destroy({where: {}, truncate: true})
        // await Precio.destroy({where: {}, truncate: true})
        await db.sync({force: true})
        console.log('datos eliminados')
        exit()
    }
    catch(error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === "-i"){
    importarDatos()
}

if(process.argv[2] === "-e"){
    eliminarDatos()
}