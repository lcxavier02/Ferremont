class Carrito{
    agregarProducto(e){
        e.preventDefault();
        if(e.target.classList.contains('añadir-carrito')){
            const ProductoA = e.target.parentElement;
            this.leerDatosProducto(ProductoA);
        }
    }

    leerDatosProducto(ProductoA){
        const InfoProducto = {
            imagen: ProductoA.querySelector('img').src,
            titulo: ProductoA.querySelector('h4').textContent,
            precio: ProductoA.querySelector('.precio span').textContent,
            id: ProductoA.querySelector('input').getAttribute('data-id'),
            cantidad : 1
        }

        let productosLS;
        productosLS = this.obtenerProductoLocalStorage();
        productosLS.forEach(function(productoLS){
            if(productoLS.id === InfoProducto.id){
                productosLS = productoLS.id;
            }
        });
        if(productosLS === InfoProducto.id){
            Swal.fire({
                icon: 'info',
                title: 'Atención',
                text: 'El producto ya ha sido agregado',
                timer: 2000,
                showConfirmButton: false
            });
        }else{
            this.insertarCarrito(InfoProducto);
        }
    }

    insertarCarrito(InfoProducto){
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
        this.guardarProductosLocalStorage(InfoProducto);
    }

    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('quitar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();
    }

    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }

        this.vaciarLocalStorage();
        return false;
    }

    guardarProductosLocalStorage(producto){
        let productos;
        productos = this.obtenerProductoLocalStorage();
        productos.push(producto);
        localStorage.setItem('productosELS', JSON.stringify(productos));
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

    vaciarLocalStorage(){
        localStorage.clear();
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

    leerLocalStorageCompra(){
        let productosLS;
        productosLS = this.obtenerProductoLocalStorage();

        productosLS.forEach(function(InfoProducto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${InfoProducto.imagen}" width="100">
                </td>
                <td>${InfoProducto.titulo}</td>
                <td>$ ${InfoProducto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" data-precio="${InfoProducto.precio}" data-id="${InfoProducto.id}" min="1" value="${InfoProducto.cantidad}">
                </td>
                <td class="cant${InfoProducto.id}" id="cant${InfoProducto.id}">${InfoProducto.precio * InfoProducto.cantidad}</td>
                <td>
                    <a href="" class="quitar-producto fas fa-times-circle" style="font-size:1.5rem" data-id="${InfoProducto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
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

    calcularTotal(){
        let productoLS;
        let total = 0, subtotal = 0, IVA = 0;

        productoLS = this.obtenerProductoLocalStorage();

        for(let i=0; i<productoLS.length; i++){
            let element = Number(productoLS[i].precio * productoLS[i].cantidad);
            total = total + element;
        }
        IVA = parseFloat(total * 0.16).toFixed(2);
        subtotal = parseFloat(total - IVA).toFixed(2);

        document.getElementById('subtotal').innerHTML = "$ " + subtotal;
        document.getElementById('iva').innerHTML = "$ " + IVA;
        document.getElementById('total').innerHTML = "$ " + total.toFixed(2);
    }
}