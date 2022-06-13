class CarritoLS{
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('quitar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
    }

    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }

        this.vaciarLocalStorage();
        return false;
    }

    obtenerProductoLocalStorage(){
        let productoLS;
        if(localStorage.getItem('productosELS') === null){
            productoLS = [];
        }else{
            productoLS = JSON.parse(localStorage.getItem('productosELS'));
        }

        return productoLS;
    }

    eliminarProductoLocalStorage(productoID){
        let productosLS;
        productosLS = this.obtenerProductoLocalStorage();
        productosLS.forEach(function(productoLS, index){
            if(productoLS.id === productoID){
                productosLS.splice(index, 1);
            }
        });

        localStorage.setItem('productosELS', JSON.stringify(productosLS));
    }

    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductoLocalStorage();

        productosLS.forEach(function(InfoProducto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${InfoProducto.imagen}" width="100">
                </td>
                <td>${InfoProducto.titulo}</td>
                <td>${InfoProducto.precio}</td>
                <td>
                    <a href="" class="quitar-producto fas fa-times-circle" data-id="${InfoProducto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    vaciarLocalStorage(){
        localStorage.clear();
    }

    procesarPedido(e){
        e.preventDefault();
        if(this.obtenerProductoLocalStorage().length === 0){
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El carrito está vacío, agrega algún producto',
                timer: 2000,
                showConfirmButton: false
            });
        }else{
            location.href = "/carrito.ejs";
        }
    }
}



