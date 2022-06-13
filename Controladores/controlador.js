const bcryptjs = require('bcryptjs');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const Swal = require('sweetalert2');
const stripe = require('stripe')('sk_test_51In6vvLPZg82XkNo0OxquRbvQFR3SblQdhxGN3UskBCf1DOqahqsy0Hz5JzJz5kJ7ZepUYFL5HfByhh4OFd0kU5l00Dh20AvLB');
const productosMySQL = require('../productos')
const mercadopago = require ('mercadopago');
const cons = require('consolidate');

mercadopago.configure({
    access_token: 'TEST-330459467577982-051000-971941f27ed168f46b92f797fd385842-748292533'
});

const controlador = {};

controlador.guardar = async (req, res) =>{

    req.getConnection( async (err, conn) =>{

        const nombre_usuario = req.body.nombre_usuario;
        const correo = req.body.correo;
        const contraseña = req.body.contraseña;
        let passwordHash = await bcryptjs.hash(contraseña, 8);

        conn.query("INSERT INTO usuario set ?", {nombre_usuario:nombre_usuario, correo: correo, contraseña: passwordHash} , async (err, rows) =>{
            console.log(rows);
            if(err){
                res.render('register');
                throw err;
            }else{
                res.render('register',{
                    alert: true,
                    alertTitle: "¡Registro exitoso!",
                    alertMessage: "¡Usuario creado con éxito!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    time: 2000,
                    ruta: '',
                    numberF : '+523329768036',
                    mailF : 'ferreteriaferremont.1@gmail.com',
                    locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                });
            }
        });
    });
};


controlador.autenticar = async (req, res) =>{
    
    const nombre_usuario = req.body.nombre_usuario;
    const contraseña = req.body.contraseña;
    let passwordHash = await bcryptjs.hash(contraseña, 8);

    if(nombre_usuario && contraseña){
        req.getConnection(async (err, conn) =>{
            conn.query('SELECT * FROM usuario WHERE nombre_usuario = ?', [nombre_usuario], async (err, result) =>{
                if(result.length == 0 || !(await bcryptjs.compare(contraseña, result[0].contraseña))){
                    res.render('login', {
                        alert: true,
                        alertTitle: "¡Error!",
                        alertMessage: "¡Usuario y/o contraseña erróneos!",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        time: false,
                        ruta: 'login.ejs',
                        login: req.session.loggedin,
                        name: req.session.usuario,
                        numberF : '+523329768036',
                        mailF : 'ferreteriaferremont.1@gmail.com',
                        locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                    });
                }else{
                    req.session.loggedin = true;
                    req.session.usuario = result[0].nombre_usuario;
                    res.render('login', {
                        alert: true,
                        alertTitle: "¡Correcto!",
                        alertMessage: "¡Inicio de sesión correcto!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        time: 2000,
                        ruta: '',
                        login: req.session.loggedin,
                        name: req.session.usuario,
                        numberF : '+523329768036',
                        mailF : 'ferreteriaferremont.1@gmail.com',
                        locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                    });
                }
            });
        });
    }else{
        res.render('login', {
            alert: true,
            alertTitle: "¡Advertencia!",
            alertMessage: "¡Ingrese un usuario y/o contraseña!",
            alertIcon: 'warning',
            showConfirmButton: false,
            time: 2000,
            ruta: 'login.ejs',
            login: req.session.loggedin,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
};


controlador.pagar = async (req, res) =>{
    const ids = req.body;

    ids.forEach(elemento => {
        req.getConnection(async (err, conn) =>{
            conn.query('SELECT * FROM producto', async(err, result) =>{
                for(i = 0; i< result.length; i++){
                    let stock = result[i].stock_producto;
                    stock--;
                    const productoEncontrado = result[i].id_producto === elemento.id;
                    conn.query('UPDATE producto SET stock_producto = ? WHERE id_producto = ?', [stock, elemento.id], async(err, rows)=>{
                        if (err) throw err;
                    });
                }
            });
        });
    });

    let preferenceStripe = {
        payment_method_types: ['card'],
        line_items: [],
        mode: 'payment',
        success_url: `http://localhost:3000/`,
        cancel_url: `http://localhost:3000/`,
    }

    ids.forEach(element => {
        preferenceStripe.line_items.push(
            {
                price_data: {
                    currency: 'mxn',
                    product_data: {
                    name: element.titulo,
                    images: [`${element.imagen}`],
                },
                    unit_amount: element.precio * 100,
                },
                quantity: 1,
            }
        );
    });

    const sessionStripe = await stripe.checkout.sessions.create(preferenceStripe);
    res.send({id : sessionStripe.id});
}

controlador.datosE = async (req, res) =>{
    const idP = 2;
    const nombre = req.body.nombre_comprador;
    const direccion = req.body.direccion_comprador;
    const telefono = req.body.telefono_comprador;
    const cp = req.body.codigo_postal;

    req.getConnection(async (err, conn) =>{
        conn.query("INSERT INTO pedido SET ?", {id_pedido: null, nombre_usuario: nombre, id_producto: idP, direccion: direccion, telefono: telefono, codigo_postal: cp}, async(err, rows) =>{
            if(err){
                res.render('carrito');
                throw err;}
            else{
                res.render('carrito',{
                    alert: true,
                    alertTitle: "¡Gracias por comprar con nosotros!",
                    alertMessage: "¡Datos de envío exitosos!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    time: 2000,
                    ruta: 'carritoCompra.ejs',
                    login: req.session.loggedin,
                    name: req.session.nombre,
                    numberF : '+523329768036',
                    mailF : 'ferreteriaferremont.1@gmail.com',
                    locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                });
            }
        });
    })
}

controlador.buscarProducto = async (req, res) =>{
    const producto = req.query.buscar;

    const productoB = producto.substr(0, 3);

    req.getConnection(async (err, conn) =>{
        const productosCMN = [];
        conn.query("SELECT * FROM producto WHERE nombre_producto LIKE ?", [productoB+'%'], async (err, rows)=>{
            if(err) throw err;
            console.log(rows);
            for(i= 0; i<rows.length; i++){
                productosCMN.push(rows[i]);
            }
            if(req.session.loggedin){
                res.render('buscar',{
                    producto : producto,
                    productoBuscado : productosCMN,
                    login: true,
                    name: req.session.usuario,
                    numberF : '+523329768036',
                    mailF : 'ferreteriaferremont.1@gmail.com',
                    locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                });
            }else{
                res.render('buscar', {
                    producto: producto,
                    productoBuscado : productosCMN,
                    login: false,
                    numberF : '+523329768036',
                    mailF : 'ferreteriaferremont.1@gmail.com',
                    locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                });
            }
        });
    });
}

controlador.buscarCat = async (req, res) =>{
    const productosCategoria = [];
    const cat = 'herramientas';
    req.getConnection(async (err, conn) =>{
        conn.query('SELECT * FROM producto WHERE categoria = ?', [cat], async (err, rows) =>{
            if(err) throw err;
            for(i = 0; i<rows.length; i++){
                productosCategoria.push(rows[i]);
            }
            if(req.session.loggedin){
                res.render('buscarCat',{
                    productoCategoria : productosCategoria,
                    login: true,
                    name: req.session.usuario,
                    numberF : '+523329768036',
                    mailF : 'ferreteriaferremont.1@gmail.com',
                    locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                });
            }else{
                res.render('buscarCat', {
                    productoCategoria : productosCategoria,
                    login: false,
                    numberF : '+523329768036',
                    mailF : 'ferreteriaferremont.1@gmail.com',
                    locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
                });
            }
        });
    });
}

module.exports = controlador;