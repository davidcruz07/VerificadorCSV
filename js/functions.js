const idiomas = {
  es: {
    mensaje: "Idioma actual: Español",
    codigoBarras: "Codigo de barras",
    fechaOptions: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    locale: 'es-ES',
    noEncontrado: "El producto no se encuentra",
    producto: "Producto",
    precio: "Precio"
  },
  en: {
    mensaje: "Current language: English",
    codigoBarras: "Barcode",
    fechaOptions: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    locale: 'en-US',
    noEncontrado: "Product not found",
    producto: "Product",
    precio: "Price"
  }
};

let productos = [];
let productos_en = [];

let idiomaActual = 'es';
let codigo = "";

function cambiarIdioma() {
  const toggle = document.getElementById("toggle");
  idiomaActual = toggle.checked ? 'en' : 'es';

  const langData = idiomas[idiomaActual];
  document.getElementById("mensaje").textContent = langData.mensaje;

  const respuesta = document.getElementById("respuesta");
  if (respuesta.innerHTML.includes(idiomas.es.codigoBarras) || respuesta.innerHTML.includes(idiomas.en.codigoBarras)) {
    respuesta.innerHTML = `
      <img src="./img/barcode.gif" alt="" width="15%" height="15%">
      <br>${langData.codigoBarras}
    `;
  }

  actualizarFechaHora();
}

function actualizarFechaHora() {
  const ahora = new Date();
  const langData = idiomas[idiomaActual];
  const fechaHoraFormateada = ahora.toLocaleDateString(langData.locale, langData.fechaOptions);
  document.getElementById('fecha-hora').textContent = fechaHoraFormateada;
}

function buscar(cod) {
  let encontrado = false;
  const lang = idiomas[idiomaActual];
  const listaProductos = idiomaActual === 'es' ? productos : productos_en;

  for (let i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i][0] === cod) {
      document.getElementById("respuesta").innerHTML = `
        ${lang.producto}: ${listaProductos[i][1]} <br>
        ${lang.precio}: ${listaProductos[i][2]} <br>
        <img src="./img/${listaProductos[i][3]}" width="25%" height="25%" >
      `;
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    document.getElementById("respuesta").innerHTML = lang.noEncontrado;
  }
}

function cargarCSV(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.trim().split("\n");
    productos = [];
    productos_en = [];

    lines.forEach(line => {
      const [codigo, nombre_es, nombre_en, precio, imagen] = line.split(",");
      productos.push([codigo, nombre_es, precio, imagen]);
      productos_en.push([codigo, nombre_en, precio, imagen]);
    });

    alert("Productos cargados correctamente.");
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle").addEventListener("change", cambiarIdioma);
  document.getElementById("theme-toggle").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
  });

  document.getElementById("csvFile").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      cargarCSV(file);
    }
  });

  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      codigo += event.key;
    } else {
      buscar(codigo);
      codigo = "";
    }
  });
});
