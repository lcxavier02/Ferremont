const compra =  new Carrito();
const listaCompra = document.querySelector('#lista-compra tbody');
const carrito = document.getElementById('carrito-c');
const BTN_R_Compra = document.getElementById('r-compra');

cargarEventos();

function cargarEventos(){
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    carrito.addEventListener('click', (ev)=>{compra.eliminarProducto(ev)});

    compra.calcularTotal();

    BTN_R_Compra.addEventListener('click', procesarCompra);
}

function procesarCompra(e){
    e.preventDefault();

    if(compra.obtenerProductoLocalStorage().length === 0){
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'No hay productos, selecciona alguno',
            timer: 2000,
            showConfirmButton: false
        }).then(function(){
            window.location = "/productos.ejs"
        })
    }
}
