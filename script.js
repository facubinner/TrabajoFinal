const urlApi = 'https://api.yumserver.com/16958/products';

function mostrarLista() {
  fetch(urlApi)
    .then(response => response.json())
    .then(productos => {
      const listaProductos = document.getElementById('listaProductos');
      listaProductos.innerHTML = ''; 

      productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${producto.idcod}</td>
          <td>${producto.titulo}</td>
          <td>${producto.precioPeso}</td>
          <td>${producto.precioDolar}</td>
          <td>${producto.fecha}</td>
          <td>
            <button class="btn-modificar" onclick="mostrarFormularioModificar('${producto.idcod}', '${producto.titulo}', ${producto.precioPeso}, ${producto.precioDolar}, '${producto.fecha}')">Modificar</button>
            <button onclick="eliminarProducto('${producto.idcod}')">Eliminar</button>
          </td>
        `;
        listaProductos.appendChild(fila);
      });
    })
    .catch(error => console.error('Error al obtener productos:', error));
}

if (document.getElementById('listaProductos')) {
  mostrarLista();
}

document.getElementById('formularioProducto')?.addEventListener('submit', function(evento) {
  evento.preventDefault();
  const producto = {
    titulo: document.getElementById('titulo').value,
    precioPeso: document.getElementById('precioPeso').value,
    precioDolar: document.getElementById('precioDolar').value,
    fecha: document.getElementById('fecha').value,
  };

  //agregar productos
  fetch(urlApi, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  })
  .then(response => response.text())
  .then(texto => {
    if (texto.trim() === "OK") {
      alert('Producto creado exitosamente');
      window.location.href = 'index.html';
    } else {
      alert(texto);
    }
  })
  .catch(error => console.error('Error:', error));
});

function mostrarFormularioModificar(idcod, titulo, precioPeso, precioDolar, fecha) {
  document.getElementById('idcod').value = idcod;
  document.getElementById('tituloMod').value = titulo;
  document.getElementById('precioPesoMod').value = precioPeso;
  document.getElementById('precioDolarMod').value = precioDolar;
  document.getElementById('fechaMod').value = fecha;

  var formulario = document.getElementById('contenedor-modificar');
  formulario.classList.add('active');
}

function modificarProducto() {
  const idcod = document.getElementById('idcod').value;
  const titulo = document.getElementById('tituloMod').value;
  const precioPeso = parseFloat(document.getElementById('precioPesoMod').value);
  const precioDolar = parseFloat(document.getElementById('precioDolarMod').value);
  const fecha = document.getElementById('fechaMod').value;

  fetch(urlApi, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "idcod": idcod,
          "titulo": titulo,
          "precioPeso": precioPeso,
          "precioDolar": precioDolar,
          "fecha": fecha
      })
  }).then(response => response.text())
      .then(data => {
          console.log(data);
          if (data.trim() === "OK") {
              alert('Producto modificado exitosamente');
              location.reload();
          } else {
              alert(data);
          }
      })
      .catch(error => console.error('Error:', error));
}

function eliminarProducto(id) {
  if (confirm('¿Está seguro que desea eliminar este producto?')) {
    fetch(urlApi, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idcod: id  
      })
    })
    .then(response => response.text())
    .then(respuesta => {
      if (respuesta.trim() === "OK") {
        alert('Producto eliminado exitosamente');
        location.reload();
      } else {
        alert(respuesta);
      }
    })
    .catch(error => console.error('Error al eliminar producto:', error));
  }
}
