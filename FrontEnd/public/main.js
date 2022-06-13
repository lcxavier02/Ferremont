let productos = [];
let total = 0;
let contador = 0;

$(document).ready(function(){

    //Mostrar-quitar menu
    $('#boton-menu').click(function(){
        
        if($('#boton-menu').attr('class') == 'fa fa-bars'){
            $('#boton-menu').removeClass('fa fa-bars').addClass('fa fa-times');
            $('.menu-nav .menu').css({'left':'0px'});
            $('.menu-nav').css({'width':'100%', 'background':'rgba(0,0,0,0.3)'});
        }else{
            $('#boton-menu').removeClass('fa fa-times').addClass('fa fa-bars');
            $('.menu-nav .menu').css({'left':'-320px'});
            $('.menu-nav .submenu').css({'left':'-320px'});
            $('.menu-nav').css({'width':'0%', 'background':'rgba(0,0,0,0.0)'});
        }

    });

    //Mostrar subemnu
    $('.menu-nav .menu > .item-submenu a').click(function(){
        var positionMenu = $(this).parent().attr('menu');

        $('.item-submenu[menu='+positionMenu+'] .submenu').css({'left':'0'});
    });

    //Ocultar submenu

    $('.menu-nav .submenu li.atras').click(function(){
        $(this).parent().css({'left':'-320px'})
    });

    $(".cantidad").change(function(){
        var cantidad = $(this).val();
        var precio = $(this).data('precio');
        var id = $(this).data('id');
        var mult = parseFloat(cantidad) * parseFloat(precio);
        $(".cant"+id).text(mult);
    });
});

function mostrarProductos(ListaProductos){
    let ProductosHTML = '';
    ListaProductos.forEach(element => {
        let button = `<input type="button" value="Añadir" class="añadir-carrito" data-id='${element.id_producto}'></input>`

        if(element.stock_producto <= 0){
            button = `<input disabled type="button" value="Sin stock" class="añadir-carrito" data-id='${element.id_producto}'></input>`
        }
        ProductosHTML +=
        `<div class="producto">
            <img src="${element.imagen}" alt="">
            <h4>${element.nombre_producto}</h4>
            <h5 class="precio">$ <span>${element.precio_producto}</span> MXN</h5>
            ${button}
        </div>`
    });
    document.getElementById('container-productos').innerHTML = ProductosHTML;
    
}

async function pay(){
        let productoLS = localStorage.getItem('productosELS');
        const preference = await(await fetch('/pay', {
        method: "POST",
        body: productoLS,
        headers: {
                "Content-Type" : "application/json"
            }
        })).json();

        var stripe = Stripe("pk_test_51In6vvLPZg82XkNoL53x0gpjh4njppnzn1lyqftCtp9glHXJ8pk0WS1c7MDAso8hIYmBEeBeykAoQWPow38LGnHd00unPuir4c");
        stripe.redirectToCheckout({ sessionId: preference.id });
}

window.onload = async() =>{
    const ListaProductos = await (await fetch("/productos")).json();
    mostrarProductos(ListaProductos);
}
//``