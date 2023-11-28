import Precio from '../models/Precio.js'
import Categoria from '../models/Categoria.js'

const admin = (req, res) => {
    res.render('propiedades/admin', {
        barra: true
    })
}

const crear = async (req, res) => {
    //Consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        barra: true,
        categorias: categorias,
        precios: precios
    })
}

export{
    admin,
    crear
}