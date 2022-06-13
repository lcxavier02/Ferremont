const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51In6vvLPZg82XkNo0OxquRbvQFR3SblQdhxGN3UskBCf1DOqahqsy0Hz5JzJz5kJ7ZepUYFL5HfByhh4OFd0kU5l00Dh20AvLB');

const productos = require('../productos')

const controladorUsuario = require('../Controladores/controlador');
const controlador = require('../Controladores/controlador');
const session = require('express-session');

var auth = function(req, res, next) {
    if (req.session.loggedin === true)
        return next();
    else
        return res.sendStatus(401);
};

router.use('/', express.static('public')); 

router.get('/index.ejs', (req, res) =>{
    res.render('index');
});

router.get('/login.ejs', (req, res) =>{
    if(req.session.loggedin){
        res.render('login',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('login', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    };
});

router.get('/register.ejs', (req, res) =>{
    if(req.session.loggedin){
        res.render('register',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('register', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
});

router.get('/productos.ejs', (req, res) =>{
    if(req.session.loggedin){
        res.render('productos',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('productos', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
});

router.get('/carrito.ejs', (req, res) =>{
    if(req.session.loggedin){
        res.render('carrito',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('carrito', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
});

router.get('/carritoCompra.ejs', (req, res) =>{
    if(req.session.loggedin){
        res.render('carritoCompra',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('carritoCompra', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
});

router.get("/productos", (req, res) => {
    res.send(productos);
})

router.get('/', (req, res) =>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('index', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
});

router.get('/logout', (req, res) =>{
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
            return next(err);
            } else {
            return res.redirect('/');
            }
        });
    }
});

router.get('/nosotros', (req, res) =>{
    if(req.session.loggedin){
        res.render('sobre_nosotros',{
            login: true,
            name: req.session.usuario,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }else{
        res.render('sobre_nosotros', {
            login: false,
            numberF : '+523329768036',
            mailF : 'ferreteriaferremont.1@gmail.com',
            locationF : 'Calle Manuel Acuña 1419, Santa Teresita, 44600 Guadalajara, Jal.'
        });
    }
});

router.get('/herramientas', controlador.buscarCat);

router.get('/buscar', controladorUsuario.buscarProducto);

router.post('/ship', controladorUsuario.datosE);

router.post('/add', controladorUsuario.guardar);

router.post('/auth', controladorUsuario.autenticar);

router.post('/pay', controladorUsuario.pagar);

module.exports = router;