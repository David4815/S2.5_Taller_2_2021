
//  --------------------- INDICE JS ---------------------------------------------------

//              01 - CAPTURA EVENTOS INIT
//              02 - MANEJO DE PAGINAS CON MENU Y NAVIGATOR
//              03 - codigo para el SELECT (combo desplegable en sucursales)
//              04 - LOGOUT
//              05 - LOGIN
//              06 - REGISTRO
//              07 - LISTADO PRODUCTOS
//              08 - DETELLE DE PORDUCTO
//              09 - FILTRAR
//                09.A - FILTRAR POR NOMBRE
//                09.A - FILTRAR POR ETIQUETA
//              10 - APLICAR FILTROS POR NOMBRE Y ETIQUETA
//              11 - NUEVO PEDIDO
// ---------------------------------------------------------------------------------------



// 01 - CAPTURA DE EVENTOS-----------------------------------------------------------------------------

document.addEventListener('init', function (event) {
  var page = event.target

  switch (page.id) {

    case `detalle`:

        let id = page.data.id;
        detalleProducto(id);       
        break;

    case `mapa`:

        setTimeout(() => {}, 1000);
        var mymap2 = L.map('mapid').setView([-34.9176711, -56.152399], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap2);
       break;

    case `nuevoPedido`:

        let idproducto = page.data.id;
        mostrarNuevoPedido(idproducto);
        break;

    case `pedidos`:

        realizarPedido();

  }


})

// 02 - MANEJO DE PAGINAS CON MENU Y NAVIGATOR------------------------------------------------------

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page, data) {
  var content = document.getElementById('myNavigator');
  var menu = document.getElementById('menu');
  content.pushPage(page, data)
    .then(menu.close.bind(menu));
};

window.fn.pop = function() {
  var content = document.getElementById('myNavigator');
  content.popPage();
};

// 03 - codigo para el SELECT (combo desplegable en sucursales)---------------------------------------------------

function editSelects(event) {
  document.getElementById('choose-sel').removeAttribute('modifier');
  if (event.target.value == 'material' || event.target.value == 'underbar') {
    document.getElementById('choose-sel').setAttribute('modifier', event.target.value);
  }
}
function addOption(event) {
  const option = document.createElement('option');
  var text = document.getElementById('optionLabel').value;
  option.innerText = text;
  text = '';
  document.getElementById('dynamic-sel').appendChild(option);
}

// 04 - LOGOUT--------------------------------------------------------------------------------------------------

function logout() {
  localStorage.removeItem('token')
  fn.load('login.html')
}
// 05 - LOGIN---------------------------------------------------------------------------------------------------

function login() {
  let username = $('#username').val()
  let password = $('#password').val()

  //   let jsonDatos={
  //     'email': "jp@gmail.com",
  //     'password': 12345678 ,
  // };

  // VERIFICACION PARA EVITAR PEDIDOS INNECESARIOS AL SERVIDOR
  if (username === '' || password === '') {
    ons.notification.alert('Debe ingresar usuario y password')
  } else {
    // ACA TIRO EL AJAX PARA VER SI ME LOGUE
    $.ajax({
      url:
        'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/usuarios/session',
      type: 'POST',

      dataType: 'json',
      // IMPORTANTE PASAR A JSON
      data: JSON.stringify({
        email: username,
        password: password,
      }),

      contentType: 'application/json',

      success: function (response) {

        ons.notification.toast('Logueando...', { timeout: 1000 })
        fn.load('home.html')
        localStorage.setItem('token', response.data.token)
        // SE AGREGA DISPLAY NONE AL INICIO EN EL MENU Y AL LOGUEARSE SE PONE VISIBLE EL MENU
        $("#menu").css('display', '');
        
      },
      error: function (e1, e2, e3) {
        console.log('Error...', e1, e2, e3)
      },
      complete: function () {
        console.log('Fin!')
      },
    })
  }
}


// 06 - REGISTRO-------------------------------------------------------------------------------------------

function registrar() {
  let nombre = $('#nombre').val()
  let apellido = $('#apellido').val()
  let email = $('#email').val()
  let passwordRegistro = $('#passwordRegistro').val()
  let direccion = $('#direccion').val()
  if (
    nombre === '' ||
    !password ||
    !apellido ||
    !email ||
    !passwordRegistro ||
    !direccion
  ) {
    ons.notification.alert('Debe ingresar usuario y password')
  } else {
    $.ajax({
      url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/usuarios',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
        nombre: nombre,
        apellido: apellido,
        email: email,
        direccion: direccion,
        password: passwordRegistro,
      }),
      contentType: 'application/json',
      // CUANDO TENGO EXITO NO RECIBO NADA?? NO LLEGA NADA EN EL DATA PERO FUNCIONA
      success: function (data) {
        // console.log(data);
        // ons.notification.alert(data.nombre)
        ons.notification.toast('Logueando...', { timeout: 1000 })
        document.querySelector('#myNavigator').pushPage('login.html')
      },
      error: function (e1, e2, e3) {
        console.log('Error...', e1, e2, e3)
      },
      complete: function () {
        console.log('Fin!')
      },
    })
  }
}

// 07 - LISTADO PRODUCTOS -------------------------------------------------------------------------------------------------------------------
function mostrarListado() {

  // TOKEN
  let token = localStorage.getItem('token')
  
  $.ajax({
    url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos',
    type: 'GET',
    headers: {
      'x-auth': token,
    },
    dataType: 'json',
    success: function (dataTraida) {
      let listaCatalogo = $('#listaCatalogo');
      listaCatalogo.html("");
      // console.log('data traida', dataTraida.data[0])
      // console.log('data traida', dataTraida.data[0].urlImagen)      

      dataTraida.data.forEach((elem) => {
        
        listaCatalogo.append(` 
          <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem._id}'}})">
        
          <div class="left">
              <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${elem.urlImagen}.jpg">
          </div>

           <div class="center">
              <span class="list-item__title" id="nomb">${elem.nombre}</span>
              <span class="list-item__subtitle">${elem.precio}UYU</span>
              <span class="list-item__subtitle">${elem.codigo}</span>
              <span class="list-item__subtitle">${elem.etiquetas}</span>
            </div>

            <div class="right">
              <span class="list-item__title">${elem.estado}</span>
            </div>

          </ons-list-item>
          
          <span class="list-item__subtitle">
              <ons-button modifier="quiet">
                  <ons-icon icon="md-face"></ons-icon>
                    Agregar a favoritos
              </ons-button>
          </span>
            
            `)
      })
     
      listaCatalogo.fadeIn()
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })
}



// 08 - DETALLE PRODUCTO---------------------------------------------------------------------------------------------------------------------------

function detalleProducto(id) {
  $.ajax({
    url: `http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos/${id}`,
    type: 'GET',
    headers: {
      'x-auth': localStorage.getItem("token"),
    },
    dataType: 'json',
    // beforeSend: function () {
    //   $(`#progresCargaDetalle`).show()
    // },
    success: function (response) {
      // console.log('data', data)
      // ons.notification.alert(response.data.nombre)
      let botonComprar = "";
      if(response.data.estado === "en stock"){

        botonComprar = `<span class="list-item__subtitle">   
        <ons-button modifier="quiet" onClick="fn.load('nuevoPedido.html', {data: { id: '${id}'}})">
                        
            <ons-icon icon="md-face"></ons-icon>
                Comprar
        </ons-button> 
    </span>`

      }

     
      $('#contenedorDetalle').html(`
      
      <div>
              <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${response.data.urlImagen}.jpg">
      </div>    

      <div>
              <span class="list-item__title">${response.data.nombre}</span>
              <span class="list-item__subtitle">${response.data.precio}UYU</span>
              <span class="list-item__subtitle">${response.data.codigo}</span>
              <span class="list-item__subtitle">${response.data.etiquetas}</span>
              <span class="list-item__subtitle">${response.data.descripcion}</span>
              <span class="list-item__subtitle">${response.data.puntaje}</span>
             
              ${botonComprar}

       </div>
        
       <div class="right">
              <span class="list-item__title">${response.data.estado}</span>
        </div>
      
      
      `)

      // $(`#progresCargaDetalle`).hide()
      $('#progressCargaDetalle').hide();
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })
}


// 09 - FILTRAR--------------------------------------------------------------------------------------------------------------------------------------------------------------

// 09.A - FILTRO POR NOMBRE-------------
function filtrar() {
  let busqueda = $('#txtBusqueda').val()
  $.ajax({
    url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos',
    type: 'GET',
    data: {
      nombre: busqueda
    },
    headers: {
      'x-auth': localStorage.getItem("token"),
    },
    dataType: 'json',
    success: function (response) {
      let listado = $('#listaCatalogo')
      console.log('data detalle', response)
      response.data.forEach((elem) => {
        listado.append(` 
        <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem.id}'}})">
         
        
        
        <div class="left">
            <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${elem.urlImagen}.jpg">
          </div>

          

          <div class="center">
            <span class="list-item__title">${elem.nombre}</span>
            <span class="list-item__subtitle">${elem.precio}UYU</span>
            <span class="list-item__subtitle">${elem.codigo}</span>
            <span class="list-item__subtitle">${elem.etiquetas}</span>
          </div>
          <div class="right">
            <span class="list-item__title">${elem.estado}</span>
          </div>
        </ons-list-item>`)
      })
      listado.fadeIn()
      $('#btnVerMas').fadeIn()
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })
}

// 09.B FILTRAR POR ETIQUETA---------------

function filtrarPoretiqueta(){
  let textoBuscado = $("#txtBusqueda").val();
  let token = localStorage.getItem('token')

  $.ajax({
    url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos',
    type: 'GET',
    headers: {
      'x-auth': token,
    },
    dataType: 'json',
    success: function (dataTraida) {
      let listaCatalogo = $('#listaCatalogo')
      

      dataTraida.data.forEach((elem) => {
        let esta = false;
        // ACA NO ANDA------------------------------------------------------------
          for(let i=0; i<listaCatalogo.length; i++){
              if(listaCatalogo.nomb===elem.nombre){
                esta=true;
              }
          }
        if(elem.etiquetas.includes(textoBuscado) && !esta){
        esta=false; 
        listaCatalogo.append(` 
          <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem._id}'}})">
           
          
          
          <div class="left">
              <img class="list-item__thumbnail" src="http://http2.mlstatic.com/D_880363-MLU44848941421_022021-I.jpg">
            </div>

            

            <div class="center">
            <span class="list-item__title">${elem._id}</span>
              <span class="list-item__title">${elem.nombre}</span>
              <span class="list-item__subtitle">${elem.precio}UYU</span>
              <span class="list-item__subtitle">${elem.codigo}</span>
              <span class="list-item__subtitle">${elem.etiquetas}</span>
            </div>
            <div class="right">
              <span class="list-item__title">${elem.estado}</span>
            </div>
          </ons-list-item>`)
        }
      })
      listaCatalogo.fadeIn()
      // $('#btnVerMas').fadeIn()
    
    },

    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })
}

// 10 - APLICAR FILTROS POR NOMBRE Y ETIQUETA -------------------------------------------------------------------

function buscar2() {
  offset = 0
  $('#listaCatalogo').empty().hide()
  // $('#listado').fadeOut(function(){
  //   $('#listado').empty();
  // });
  filtrar();
  filtrarPoretiqueta();
  
}


// 11 - NUEVO PEDIDO ---------------------------------------------------------------------------------------------

function mostrarNuevoPedido(id){
  
// INGRESO NUEVO PEDIDO

$.ajax({
  url: `http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos/${id}`,
  type: 'GET',
  headers: {
    'x-auth': localStorage.getItem("token"),
  },
  dataType: 'json',
  // beforeSend: function () {
  //   $(`#progresCargaDetalle`).show()
  // },
  success: function (response) {
    // console.log('data', data)
    // ons.notification.alert(response.data.nombre)
    
  //   for(let i=0; i<sucursales.length; i++){
  //     `$('#choose-sel').append(<option value=${sucursales[i]}></option>)`
  // }
    let precioTotal = response.data.precio;
    
   
    $('#ContenedorNuevoPedido').html(`
    
    <div>
            <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${response.data.urlImagen}.jpg">
    </div>    

    <div>
            <span class="list-item__title">${response.data.nombre}</span>
            <span class="list-item__subtitle">${response.data.precio}UYU</span>
            <p>
              <ons-input id="cantidadPedida" modifier="underbar" placeholder="cantidadPedida" value="1" float></ons-input>
            </p>
            <div id="precioTotal">
            <p>Precio total ${precioTotal}</p>
            </div>

           
            <h3>Seleccione sucursal de retiro:</h3>

 

              <div id="lista"> </div>
            
              
              <span class="list-item__subtitle">   
              <ons-button modifier="quiet" onClick="fn.load('pedidos.html', {data: { id: '${id}'}})">
                              
                  <ons-icon icon="md-face"></ons-icon>
                      Comprar
              </ons-button> 
          </span>

        
     </div>
        
    `
    
    )
    
    
    
    // $(`#progresCargaDetalle`).hide()
    $('#progressCargaDetalle').hide();
  },
  error: function (e1, e2, e3) {
    console.log('Error...', e1, e2, e3)
  },
  complete: function () {
    console.log('Fin!')
  },
})


   // TRAER SUCURSALES
   $.ajax({
    url: `http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/sucursales`,
    type: 'GET',
    headers: {
      'x-auth': localStorage.getItem("token"),
    },
    dataType: 'json',
    // beforeSend: function () {
    //   $(`#progresCargaDetalle`).show()
    // },
    success: function (suc) {
      

     $("#lista").html(`<ons-select id="choose-sel" onchange="editSelects(event)"> 
     <select class="select-input" id="select">
  
  </select>        
     </ons-select>`) 
      for(let i=0; i<suc.data.length; i++){
        $('#select').append(`<option value="hola">${suc.data[i].nombre}</option>`) 
    }

      console.log("sucursales", suc);
      // console.log("sucursales2data", suc.data[0].nombre);
    
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })

  
}


// REALIZAR PEDIDO

function realizarPedido(){

  // let cant = 2;
  // let idProd = "5fd63f6f1af7571a10ff2a3a";
  // let idSuc = "601bf7d03b11a01a78163136";

  $.ajax({
    url: `http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/pedidos`,
    type: 'POST',
    headers: {
      'x-auth': localStorage.getItem("token"),
    },
    dataType: 'json',
    data: JSON.stringify({
        cantidad: 2,
        idProducto: "5fd63f6f1af7571a10ff2a3a",
        idSucursal: "601bf7d03b11a01a78163136",
    }),
  
    
    // beforeSend: function () {
    //   $(`#progresCargaDetalle`).show()
    // },
    contentType: 'application/json',
    success: function () {

        
        ons.notification.alert("pedido exitoso")
    
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })

}




