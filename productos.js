const express = require('express');
const path = require('path');
const myConecction = require('express-myconnection');
const mysql = require('mysql');

const productos = [];

let sql = "SELECT * FROM producto";

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ferremont'
});

conn.connect(function(err){
    if(err) throw err;
    conn.query(sql, function(err, result){
        for(i = 0; i<result.length; i++){
            let producto = result[i];
            productos.push(producto);
        }
    });
});

module.exports = productos;