
const admin = (req, res) => {
    res.render('propiedades/admin', {
        barra: true
    })
}

const crear = (req, res) => {
    res.render('propiedades/crear', {
        barra: true
    })
}

export{
    admin,
    crear
}