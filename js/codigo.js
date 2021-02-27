
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
// 12 REALIZAR PEDIDO
// 13 - DISTANCIA ENTRE 2 PUNTOS PARA MAPA
// ---------------------------------------------------------------------------------------
localStorage.setItem("paginaActual","");


// 01 - CAPTURA DE EVENTOS-----------------------------------------------------------------------------

document.addEventListener('init', function (event) {
  var page = event.target

  switch (page.id) {

    

    case `detalle`:

        let id = page.data.id;
        detalleProducto(id);       
        break;

    case `nuevoPedido`:

        let idproducto = page.data.id;
        mostrarNuevoPedido(idproducto);
        traerSucursales();

        setTimeout(() => {

          var mymap = L.map('mapidPedido').setView([-34.9176711, -56.152399], 15);
          
          L.marker([-34.9028068, -56.178735]).addTo(mymap).bindPopup('Suc. Cordon').openPopup();
          L.marker([-34.92395575635019, -56.158623015187054]).addTo(mymap).bindPopup('Suc. Punta Carretas').openPopup();
          L.marker([-34.90210189957535, -56.13432098820147]).addTo(mymap).bindPopup('Suc. Pocitos').openPopup();
          L.marker([-34.88929867295414, -56.18685021518797]).addTo(mymap).bindPopup('Suc. Aguada').openPopup();
          L.marker([-34.90606911366034, -56.19570190169448]).addTo(mymap).bindPopup('Suc. Centro').openPopup();
          
          
          // Mi ubicacion
          L.marker([-34.9176711, -56.152399]).addTo(mymap).bindPopup('Yo').openPopup();
         

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mymap);
        
        }, 1000);
      
        break;
    case `pedidos`:

      listarPedidos();


        case `favoritos`:

          mostrarFavoritos();
          break;
  }


  
  // if (event.target.id == "nuevoPedido") {
  //   document.getElementById("my-switch").addEventListener('change', function(e) {
  //     console.log('click', e);
  //   });
  // }


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

// prueba para precio total
localStorage.removeItem("paginaActual");
localStorage.setItem("paginaActual", page);

// fin prueba


  // if(page!="catalogo.html"){

  //   content.pushPage(page, data)
  //   .then(menu.close.bind(menu));
  // }else{
  //   content.resetToPage(page, data)
  //   .then(menu.close.bind(menu));
  // }
  
  if(page==="catalogo.html" || page==="favoritos.html" || page==="pedidos.html"){
    content.resetToPage(page, data)
    .then(menu.close.bind(menu));
    
  }else{
    content.pushPage(page, data)
    .then(menu.close.bind(menu));
  }
    
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
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("userId", response.data.email);
        // SE AGREGA DISPLAY NONE AL INICIO EN EL MENU Y AL LOGUEARSE SE PONE VISIBLE EL MENU
        $("#menu").css('display', '');
        mostrarListado();
        
      },
      error: function (e1, e2, e3) {
        console.log('Error...', e1, e2, e3)
        ons.notification.alert({message: 'Usuario o Clave incorrecta.', title: 'Atencion!'})
      },
      complete: function () {
        console.log('Fin!')
        
      },
    })
  }
}


// GUARDAR CATALOGO

function guardarCatalogo(){




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
    ons.notification.alert('Debe completar todos los campos')
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
let catalogoEntero;
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
      catalogoEntero = dataTraida;
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
              <span class="list-item__subtitle">${elem.estado}</span>
            </div>

            <div class="right">
              <span class="list-item__title">${elem.estado}</span>
            </div>

          </ons-list-item>
          
            
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
             
             <span class="list-item__subtitle">   
                  <ons-button modifier="quiet" onClick="guardarFavorito('${id}')">
                    <ons-icon icon="md-face"></ons-icon>
                      Agregar a Favoritos
                  </ons-button> 
            </span>

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
        <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem._id}'}})">
         
        
        
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
  let textoBuscado = $("#txtBusqueda").val().toLowerCase();
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

    
        let etiquetasEnMinuscula= elem.etiquetas.map(function(x){ return x.toLowerCase(); })
        let esta = false;
        
          
              if(elem.nombre.toLowerCase().includes(textoBuscado)){
                esta=true;
              }
        if(etiquetasEnMinuscula.includes(textoBuscado) && !esta){
        esta=false; 
        listaCatalogo.append(` 
          <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem._id}'}})">
           
          
          
          <div class="left">
              <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${elem.urlImagen}.jpg">
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

// 09.A - FILTRO CODIGO PARA QR-------------
function filtrarPorCodigo(unCodigo) {
  
  $.ajax({
    url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos',
    type: 'GET',
    data: {
      codigo: unCodigo
    },
    headers: {
      'x-auth': localStorage.getItem("token"),
    },
    dataType: 'json',
    success: function (response) {
      let listado = $('#listaCatalogo');
      listado.empty().hide();
      console.log('data detalle', response)
      response.data.forEach((elem) => {
        listado.append(` 
        <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem._id}'}})">
         
        
        
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
              <ons-input id="cantidadPedida" onChange="alert('hola')" modifier="underbar" placeholder="cantidadPedida" value="1" float></ons-input>
            </p>

            
            <div id="precioTotal">
            
            <p id="pTotal">Precio total: ${precioTotal} UYU</p>
            </div>

           
            <h3>Seleccione sucursal de retiro:</h3>



              <div id="lista"> </div>
            
              <div id="mapidPedido"></div>

              <span class="list-item__subtitle">   
              <ons-button modifier="quiet" onClick="realizarPedido('${id}'), fn.load('home.html')">
                              
                  <ons-icon icon="md-face"></ons-icon>
                      Comprar
              </ons-button> 
          </span>

        
     </div>
        
    `
    
    )
    // boton para calcular precio total
    // <ons-button id="calcularPrecioTotal" onclick="${function calcular(){$("#pTotal").html(precioTotal*($("#cantidadPedida").val()))}})">Calcular Precio Total</ons-button>
    
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
// TRAER SUCURSALES
function traerSucursales(){
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
     <select class="select-input" id="selectSucursal">
  
  </select>        
     </ons-select>`) 
      for(let i=0; i<suc.data.length; i++){
        $('#selectSucursal').append(`<option value="${suc.data[i]._id}">${suc.data[i].nombre}</option>`) 
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
// 12 - REALIZAR PEDIDO--------------------------------------------------------------------------------------------------------------------------

function realizarPedido(idProducto){

  let cant = $("#cantidadPedida").val();
  let idSuc = $("#selectSucursal").val();
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
        cantidad: cant,
        idProducto: idProducto,
        idSucursal: idSuc,
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










  // 13 - DISTANCIA ENTRE 2 PUNTOS PARA MAPA
// function distance(lat1, lon1, lat2, lon2, unit) {
// 	if ((lat1 == lat2) && (lon1 == lon2)) {
// 		return 0;
// 	}
// 	else {
// 		var radlat1 = Math.PI * lat1/180;
// 		var radlat2 = Math.PI * lat2/180;
// 		var theta = lon1-lon2;
// 		var radtheta = Math.PI * theta/180;
// 		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
// 		if (dist > 1) {
// 			dist = 1;
// 		}
// 		dist = Math.acos(dist);
// 		dist = dist * 180/Math.PI;
// 		dist = dist * 60 * 1.1515;
// 		if (unit=="K") { dist = dist * 1.609344 }
// 		if (unit=="N") { dist = dist * 0.8684 }
// 		return dist;
// 	}
// }


// FAVORITOS--------------------------------------------------------------

function guardarFavorito(idFavorito) {
  if (localStorage.getItem('favoritos') === null) {
    localStorage.setItem('favoritos', '[]');
  }
  let userId = localStorage.getItem('userId');
  let vecFavs = JSON.parse(localStorage.getItem('favoritos'));
  let agregado = false;
  vecFavs.forEach(function (elem) {
    if (elem.idUsuario === userId) {
      if (!elem.favoritos.includes(idFavorito)) {
        elem.favoritos.push(idFavorito);
      }
      agregado = true;
    }
  });
  if (!agregado) {
    vecFavs.push({ idUsuario: userId, favoritos: [idFavorito] });
  }
  localStorage.setItem('favoritos', JSON.stringify(vecFavs));
}


function removerFavorito(idFavorito) {
  if (localStorage.getItem('favoritos') === null) {
    localStorage.setItem('favoritos', '[]');
  }
  let userId = localStorage.getItem('userId');
  let vecFavs = JSON.parse(localStorage.getItem('favoritos'));
  vecFavs.forEach(function (elem) {
    if (elem.idUsuario === userId) {
      if (elem.favoritos.includes(idFavorito)) {
        let pos = elem.favoritos.indexOf(idFavorito);
        elem.favoritos.splice(pos, 1);
      }
    }
  });
  localStorage.setItem('favoritos', JSON.stringify(vecFavs));
}


function obtenerFavoritos() {
  if (localStorage.getItem('favoritos') === null) {
    localStorage.setItem('favoritos', '[]');
  }
  let userId = localStorage.getItem('userId');
  let vecFavs = JSON.parse(localStorage.getItem('favoritos'));
  let favs = [];
  vecFavs.forEach(function (elem) {
    if (elem.idUsuario === userId) {
      favs = elem.favoritos;
    }
  });
  return favs;
}


// REGALITO 2 FILTROS

// function filtrar(productos, filtro) {
//   let filtrado = [];
//   productos.forEach(function (elem) {
//     if (elem.nombre.includes(filtro) || elem.etiquetas.includes(filtro)) {
//       filtrado.push(elem);
//     }
//   });
//   return filtrado;
// }


// $(document).ready(function() {
//   let page = localStorage.getItem("paginaActual");

//     if(page === "nuevoPedido.html"){

//       $("#cantidadPedida").on("keyup", function() {
//       var largo = $("#cantidadPedida").val().length
//       // Ocultar o mostrar de acuerdo al largo del texto
//       if (largo > 0) {
//           $("#pTotal").html("holis");
//       } else {
//           $("#actualizar").css("display", "none");
//       }
//   });
// }
  



//   }
//   );


// $(document).ready(function() {
//   $("#cantidadPedida").on("keyup", function() {
//       var cantidad = $("#cantidadPedida").val()
//       // Ocultar o mostrar de acuerdo al largo del texto
//       if (cantidad > 0) {
//           $("#pTotal").html("hola");
//       } else {
//           $("#pTotal").html("hola");
//       }
//   });
// });






function mostrarFavoritos(){

  let favoritos = obtenerFavoritos();
  
  $("#listaFavoritos").empty();

  for(let i =0; i < catalogoEntero.data.length; i++) {
    favoritos.forEach(function(fav){
  
      if (catalogoEntero.data[i]._id === fav) {
        
        $("#listaFavoritos").append(`
        <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${catalogoEntero.data[i]._id}'}})">
          
        <div class="left">
            <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${catalogoEntero.data[i].urlImagen}.jpg">
        </div>
  
         <div class="center">
            <span class="list-item__title" id="nomb">${catalogoEntero.data[i].nombre}</span>
            <span class="list-item__subtitle">${catalogoEntero.data[i].precio}UYU</span>
            <span class="list-item__subtitle">${catalogoEntero.data[i].codigo}</span>
            <span class="list-item__subtitle">${catalogoEntero.data[i].etiquetas}</span>
          </div>
  
          <div class="right">
            <span class="list-item__title">${catalogoEntero.data[i].estado}</span>
          </div>
  
        </ons-list-item>
        
        <span class="list-item__subtitle">   
              <ons-button modifier="quiet" onClick="removerFavorito('${catalogoEntero.data[i]._id}'),fn.load('favoritos.html')">
                   <ons-icon icon="md-face"></ons-icon>
                    Eliminar Favoritos
              </ons-button> 
         </span>
        
        `)
      }
  
  
  
    })
  
  };
  
  }


  // document.addEventListener("init", function(event) {
  //   if (event.target.id == "my-page") {
  //     document.getElementById("my-switch").addEventListener('change', function(e) {
  //       console.log('click', e);
  //     });
  //   }
  // }, false);


  function listarPedidos(){
    $('#listaPedidos').empty();
 // TOKEN
 let token = localStorage.getItem('token')
  
 $.ajax({
   url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/pedidos',
   type: 'GET',
   headers: {
     'x-auth': token,
   },
   dataType: 'json',
   success: function (dataTraida) {
    //  catalogoEntero = dataTraida;
   
     // console.log('data traida', dataTraida.data[0])
     // console.log('data traida', dataTraida.data[0].urlImagen)      
    //  fn.load('detalle.html', {data: { id: '${elem._id}'}})
     dataTraida.data.forEach((elem) => {
       
      $('#listaPedidos').append(` 
         <ons-list-item onClick="evaluarEstadoPedido('${elem._id}','${elem.estado}')">
       
         <div class="left">
             <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/assets/imgs/${elem.producto.urlImagen}.jpg">
         </div>

          <div class="center">
             <span class="list-item__title" id="nomb">${elem.producto.nombre}</span>
             <span class="list-item__subtitle">${elem.total}UYU</span>
             <span class="list-item__subtitle">${elem.producto.codigo}</span>
             <span class="list-item__subtitle">${elem.producto.etiquetas}</span>
             <span class="list-item__subtitle">${elem.sucursal.nombre}</span>
             <span class="list-item__subtitle">${elem.estado}</span>
           </div>

           <div class="right">
             <span class="list-item__title">${elem.estado}</span>
           </div>

         </ons-list-item>
         
           
           `)
     })
    
     $('#listaPedidos').fadeIn()
   },
   error: function (e1, e2, e3) {
     console.log('Error...', e1, e2, e3)
   },
   complete: function () {
     console.log('Fin!')
   },
 })
}


function evaluarEstadoPedido(idProducto, estadoProducto){
if(estadoProducto === 'pendiente'){
  showTemplateDialog(idProducto);
}else{
  ons.notification.alert('Pedido ya entregado');
}
}
// alert para agregar opinion de producto---------------------------------------------------------------

function pedirOpinion(){

  // TOKEN
 let token = localStorage.getItem('token')
 let unComentario = $("#comentarioPedido").val();
 let idPedido = localStorage.getItem('idPedido'); 
 $.ajax({
   url: `http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/pedidos/${idPedido}`,
   type: 'PUT',
   headers: {
     'x-auth': token,
     

   },
   dataType: 'json',
   data: JSON.stringify({
    comentario: unComentario,
    
  }),
  contentType: 'application/json',
   success: function () {
    
     listarPedidos();
     
   },
   error: function (e1, e2, e3) {
     console.log('Error...', e1, e2, e3)
   },
   complete: function () {
     console.log('Fin!')
   },
 })


}



var createAlertDialog = function() {
  var dialog = document.getElementById('my-alert-dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('alert-dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};

var hideAlertDialog = function() {
  document
    .getElementById('my-alert-dialog')
    .hide();
};

var notify = function() {
  ons.notification.alert({ message:'<ons-input id="nombre" modifier="underbar" placeholder="comente aqui" float></ons-input>' , title: 'Ingrese un comentario.'});
};
  


// ESCANEAR QR------------------------------------------------------------------------------------------------------------


function onDeviceReady() {
  //pido permisos para usar la camara
  QRScanner.prepare(prepareCallback);
}


//función que se dispara al ingresar a la página del scanner
function escanear() {
  //si hay scanner
  if (window.QRScanner) {
    //esto lo uso para mostrar la cam en la app...
    //por defecto la vista previa queda por encima del body y el html.
    //pero por un tema de compatibilidad con onsen queda por debajo de la page.
    //Mirar el css y ver cómo hay que hacer que esta page sea transparente para que se vea la camara
    window.QRScanner.show(function (status) {
      //función de scan y su callback
      window.QRScanner.scan(scanCallback);
    });
  }
}

function scanCallback(err, text) {
  if (err) {
    // an error occurred, or the scan was canceled (error code `6`)
    ons.notification.alert(JSON.stringify(err));
  } else {
    //si no hay error escondo el callback y vuelvo a la pantalla anterior
    //pasando el string que se escaneó con la url del producto
    QRScanner.hide();
    filtrarPorCodigo(`${text}`)
    // fn.load('detalle.html', {data: { id: '${elem._id}'}})
    // myNavigator.popPage({ data: { scanText: text } });
  }
}

// FALTA DE INTERNET-------------------------------------------------------------------------------------------

//callbacks para el device ready de cordova y el el de onsen-------------??????????????????????????????????????????????????????????????????????????????????------
// document.addEventListener('deviceready', onDeviceReady, false);
// ons.ready(init);

//bind para cuando el dispositivo se queda sin internet
document.addEventListener(
  'offline',
  function () {
    console.log('offline callback');
    myNavigator.pushPage('offline.html');
  },
  false
);
//bind para cuando el dispositivo retoma internet
document.addEventListener(
  'online',
  function () {
    myNavigator.popPage();
  },
  false
);

// prueba switch
function cambiarEstadoSwitch(){
  $("#switchHome").attr(checked, false);
}



// PARA MOSTRAR Y OCULTAR DIALGO----------------------------------------

var showTemplateDialog = function(idPedido) {
  var dialog = document.getElementById('my-dialog');
  localStorage.setItem('idPedido', idPedido);
  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};

var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};



// PRUEBA PRUEBA ---------------------------------------------------------------------------------------------------------------------------
// L.marker([posDevice.latitude, posDevice.longitude]).addTo(mymap).bindPopup('Yo').openPopup();


function obtenerCoordenadasSucursal(){
let coordenadas = [];
  $.ajax({
    url: `https://nominatim.openstreetmap.org/search`,
    
    data: {
      format : "json",
      q: "Avenida 18 de Julio 1743"
    },

    type: 'GET',
    
    dataType: 'json',
    
    contentType: 'application/json',
    success: function (data) {
      
console.log('latitud', data[0].lat)
console.log('longitud', data[0].lon)
    
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })


}
let miUbicacion = [];

// Mis coordenadas
navigator.geolocation.getCurrentPosition(function(data){
  let lat = data.coords.latitude
  let long = data.coords.longitude
  console.log(lat);
  console.log(long);
  miUbicacion.push(lat,long)
  console.log('adentro',miUbicacion[0])
  });
  console.log('afuera', miUbicacion[0])
  