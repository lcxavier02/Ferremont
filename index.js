const express = require('express')
const path = require('path')
const app = express()
const myConecction = require('express-myconnection');
const mysql = require('mysql');
const morgan = require('morgan');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const consolidate = require('consolidate');
const cookie = require('cookie-parser');
const stripe = require('stripe')('sk_test_51In6vvLPZg82XkNo0OxquRbvQFR3SblQdhxGN3UskBCf1DOqahqsy0Hz5JzJz5kJ7ZepUYFL5HfByhh4OFd0kU5l00Dh20AvLB');
const port = 3000

//Importaciones
const Rutas = require('./Rutas/UsuarioR');

//Middleware
app.use(morgan('dev'));
app.use(myConecction(mysql, {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'ferremont'
}, 'single'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Configuracion
app.set('views', './FrontEnd/views');
app.engine('ejs', consolidate.ejs);
app.set('view engine', 'ejs');
app.use(express.static('./FrontEnd/public')); 

//Rutas
app.use('/', Rutas);

//Incializar
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})