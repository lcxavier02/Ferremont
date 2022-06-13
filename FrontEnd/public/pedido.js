const carro = new Carrito();
const carrito = document.getElementById('carrito');
const productos_c = document.getElementById('container-productos');
const listaProductos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBoton = document.getElementById('vaciar-carrito');
const procesarPedidoBTN = document.getElementById('procesar-pedido');

cargarEventos();

function cargarEventos(){
    productos_c.addEventListener('click', (ev) =>{carro.agregarProducto(ev)});

    carrito.addEventListener('click', (ev) =>{carro.eliminarProducto(ev)});

    vaciarCarritoBoton.addEventListener('click', (ev) =>{carro.vaciarCarrito(ev)});

    document.addEventListener('DOMContentLoaded', carro.leerLocalStorage());

    procesarPedidoBTN.addEventListener('click', (ev) =>{carro.procesarPedido(ev)});
}