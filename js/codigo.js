// ons.boostrap();
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
        if(elem.etiquetas.includes(textoBuscado && !esta)){
          
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

document.addEventListener('init', function (event) {
  var page = event.target

  switch (page.id) {
    case `detalle`:
      // let id = page.data.id
      let id = "601bf7cf3b11a01a78163122"
      // ons.notification.alert(id)

      detalleProducto(id)

      break
  }

  // if (page.id === 'detalle') {
  //       let id = page.data.id;
  //       detalle(id);
  //     }
})

function irARegistro() {
  document.querySelector('#myNavigator').pushPage('registro.html')
}

function irLogin() {
  document.querySelector('#myNavigator').pushPage('login.html')
}

function navegar(page) {
  document.querySelector('#myNavigator').pushPage(`${page}.html`)
}

// REGISTRO-------------------------------------------------------------------------------------------

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
      success: function (data) {
        ons.notification.alert(`${data.nombre}`, data)
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

// menu------
window.fn = {}

window.fn.open = function () {
  var menu = document.getElementById('menu')

  menu.open()
}

window.fn.load = function (page) {
  var content = document.getElementById('content')
  var menu = document.getElementById('menu')
  content.load(page).then(menu.close.bind(menu))
}

window.fn.load = function (page, idProducto) {
  var content = document.getElementById('content')
  var menu = document.getElementById('menu')
  content.load(page).then(menu.close.bind(menu))
  data: {
    id: idProducto
  }
}

// fin menu---

// LOGIN---------------------------------------------------------------------------------------------------

function login() {
  let username = $('#username').val()
  let password = $('#password').val()
  //   let jsonDatos={
  //     'email': "jp@gmail.com",
  //     'password': 12345678 ,
  // };
  if (username === '' || password === '') {
    ons.notification.alert('Debe ingresar usuario y password')
  } else {
    // ACA TIRO EL AJAX PARA VER SI ME LOGUE

    $.ajax({
      url:
        'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/usuarios/session',
      type: 'POST',

      dataType: 'json',
      data: JSON.stringify({
        email: username,
        password: password,
      }),

      contentType: 'application/json',

      success: function (response) {
        console.log(response)
        ons.notification.toast('Logueando...', { timeout: 1000 })
        fn.load('home.html')
        localStorage.setItem('token', response.data.token)
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

// LOGOUT-------------------------------------------------------------------------------

function logout() {
  localStorage.removeItem('token')
  fn.load('login.html')
}

// LISTADO PRODUCTOS
function mostrarListado() {
  let token = localStorage.getItem('token')
  console.log(token)
  $.ajax({
    url: 'http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos',
    type: 'GET',
    headers: {
      'x-auth': token,
    },
    dataType: 'json',
    success: function (dataTraida) {
      let listaCatalogo = $('#listaCatalogo')
      console.log('data traida', dataTraida.data[0])
      console.log('data traida', dataTraida.data[0].urlImagen)

      dataTraida.data.forEach((elem) => {
        
        listaCatalogo.append(` 
          <ons-list-item onClick="fn.load('detalle.html', {data: { id: '${elem._id}'}})">
           
          
          
          <div class="left">
              <img class="list-item__thumbnail" src="http://http2.mlstatic.com/D_880363-MLU44848941421_022021-I.jpg">
            </div>

            

            <div class="center">
            <span class="list-item__title">${elem._id}</span>
              <span class="list-item__title" id="nomb">${elem.nombre}</span>
              <span class="list-item__subtitle">${elem.precio}UYU</span>
              <span class="list-item__subtitle">${elem.codigo}</span>
              <span class="list-item__subtitle">${elem.etiquetas}</span>
            </div>
            <div class="right">
              <span class="list-item__title">${elem.estado}</span>
            </div>
          </ons-list-item>`)
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

// DETALLE PRODUCTO

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
      

     
      $('#contenedorDetalle').html(`
      
      <div>
              <img class="list-item__thumbnail" src="http://http2.mlstatic.com/D_880363-MLU44848941421_022021-I.jpg">
      </div>    

      <div>
              <span class="list-item__title">${response.data.nombre}</span>
              <span class="list-item__subtitle">${response.data.precio}UYU</span>
              <span class="list-item__subtitle">${response.data.codigo}</span>
              <span class="list-item__subtitle">${response.data.etiquetas}</span>
              <span class="list-item__subtitle">${response.data.descripcion}</span>
              <span class="list-item__subtitle">${response.data.puntaje}</span>
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

/* <div class="left">
              <img class="list-item__thumbnail" src="http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/productos/${elem.urlImagen}">
            </div> */

// PRUEBA PARA OBTENER FOTO DE ARTICULO
function obtenerFoto(urlFoto) {
  let token = localStorage.getItem('token')
  console.log(token)
  $.ajax({
    url: `http://ec2-54-210-28-85.compute-1.amazonaws.com:3000/api/${urlFoto}`,
    type: 'GET',
    headers: {
      'x-auth': token,
    },
    dataType: 'json',
    success: function (dataTraida) {
      let url = dataTraida
      return url
    },

    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })
}

// FILTRAR-----------------------------------------------------
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
            <img class="list-item__thumbnail" src="http://http2.mlstatic.com/D_880363-MLU44848941421_022021-I.jpg">
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

function buscar2() {
  offset = 0
  $('#listaCatalogo').empty().hide()
  // $('#listado').fadeOut(function(){
  //   $('#listado').empty();
  // });
  filtrar();
  filtrarPoretiqueta();
  
}

function buscar() {
  offset = 0
  $('#listado').empty().hide()
  // $('#listado').fadeOut(function(){
  //   $('#listado').empty();
  // });
  busqueda()
}

function busqueda() {
  let busqueda = $('#txtBusqueda').val()
  $.ajax({
    url: 'https://api.mercadolibre.com/sites/MLU/search',
    type: 'GET',
    data: {
      q: busqueda,
      offset: offset,
      limit: 5,
    },
    dataType: 'json',
    success: function (data) {
      let listado = $('#listado')
      console.log('data detalle', data)
      data.results.forEach((elem) => {
        listado.append(` <ons-list-header>Thumbnails and titles</ons-list-header>
          <ons-list-item onClick="document.querySelector('#myNavigator').pushPage('detalle.html', {data: { id: '${elem.id}'}})">
            <div class="left">
              <img class="list-item__thumbnail" src=${elem.thumbnail}">
            </div>
            <div class="center">
              <span class="list-item__title">${elem.title}</span><span class="list-item__subtitle">${elem.price} ${elem.currency_id}</span>
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

function verMas() {
  offset += 5
  busqueda()
}

function alerta() {
  ons.notification.alert('Hola mundo')
}

function detalle(id) {
  $.ajax({
    url: `https://api.mercadolibre.com/items/${id}/description`,
    type: 'GET',

    dataType: 'json',
    beforeSend: function () {
      $(`#progresCargaDetalle`).show()
    },
    success: function (data) {
      console.log('data', data)
      $(`#pDetalle`).text(data.plain_text)
      $(`#progresCargaDetalle`).hide()
    },
    error: function (e1, e2, e3) {
      console.log('Error...', e1, e2, e3)
    },
    complete: function () {
      console.log('Fin!')
    },
  })
}
