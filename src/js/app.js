let pagina = 1;

const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded", function () {
    //iniciarApp();
    mostrarServicios();
    mostrarSeccion();
    eventListeners();
});

//function iniciarApp() {
function eventListeners() {
    //mostrarServicios();
    //mostrarSeccion();
    cambiarSeccion();
    paginaSiguiente();
    paginaAnterior();
    botonesPaginador();
    mostrarResumen();
    nombreCita();
    fechaCita();
    deshabilitarFechaAnterior();
    horaCita();
}

function mostrarSeccion() {
    const seccionAnterior = document.querySelector(".mostrar-seccion");
    if(seccionAnterior) {
        seccionAnterior.classList.remove("mostrar-seccion"); // cambia la seccion que este activa actualmente
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");

    const tabAnterior = document.querySelector(".tabs .actual")
    if(tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll(".tabs button");

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", event => {
            event.preventDefault();
            pagina = parseInt(event.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        })
    })
}


async function mostrarServicios() {
    try {
        const resultado = await fetch("../../servicios.json");
        const db = await resultado.json();
        const {servicios} = db; // Se hace un destructuring al .json para poder extraer la informacion contenida

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            //Generar Nombre del Servicio
            const nombreServicio = document.createElement("P");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio");

            //Generar Precio del Servicio
            const precioServicio = document.createElement("P");
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add("precio-servicio");

            //Generar Contenedor del Servicio
            const servicioDiv = document.createElement("DIV");
            servicioDiv.classList.add("servicio");
            servicioDiv.dataset.idServicio = id; // Permite seleccionar el id del div del servicio

            //Seleccionar un Servicio de Peluqueria
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar Precio y Nombre al Contenedor del Servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectar lo del contenedor al HTML
            document.querySelector("#servicios").appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(event) {
    let elemento;

    if(event.target.tagName == "P") { //Fuerza que al dar clic en un elemento seleccione el div al que pertenece
        elemento = event.target.parentElement;
    } else {
        elemento = event.target;
    }

    if(elemento.classList.contains("seleccionado")) { // Permite agregar o quitar la clase "seleccionado" al div al cual damos clic, "contains" permite revisar que clase esta activa
        elemento.classList.remove("seleccionado");
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add("seleccionado");

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio), //Captura el id del servcio que seleccionamos
            nombre: elemento.firstElementChild.textContent, //Captura el texto del nombre del servicio que seleccionemos
            precio: elemento.firstElementChild.nextElementSibling.textContent // Captura el texto del elemento siguiente que seria el precio.
        }

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id != id); // Permite filtrar el servicio eleiminado trayaendo la informacion que queda y es diferente al que eliminamos
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
        pagina++;
        botonesPaginador(); // Se carga nuevamente esta funcion para que revise en que pagina se encuentra
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
        pagina--;
        botonesPaginador(); // Se carga nuevamente esta funcion para que revise en que pagina se encuentra
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if(pagina == 1) {
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove('ocultar');
    } else if(pagina == 3) {
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion();
}

function mostrarResumen() {
    const {nombre, fecha, hora, servicios} = cita; // Destructuring a la informacion almacenada en cita

    const resumenDiv = document.querySelector(".contenido-resumen");

    while (resumenDIV.firstChild) {  // Limpia el HTML de mensajes anteriores
        resumenDiv.removeChild(resumenDIV.firstChild);
    }

    if(Object.value(cita).includes("")) { // De esta manera se pregunta si el objeto cita esta vacio para validar que tenga la informacion.
        const noServicios = document.createElement("P");
        noServicios.textContent = "Faltan Datos de Servicios: Nombre, Hora, Fecha, Servicio";

        noServicios.classList.add("invalidar-cita");

        resumenDiv.appendChild(noServicios); // Agrega a resumenDiv el objeto noServicios

        return;
    }

    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";

    const nombreCita = document.createElement("P");
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement("DIV");
    serviciosCita.classList.add("resumen-servicios");

    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";
    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    servicios.forEach(servicio => {
        const {nombre, precio} = servicio;

        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement("P");
        precioServicio.textContent = precio;
        precioServicio.classList.add("precio");

        const totalServicio = precio.split("$");
        cantidad += parseInt(totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });    

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement("P");
    cantidadPagar.classList.add("total");
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $${cantidad}`;
    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector("#nombre");

    nombreInput.addEventListener("input", (event) => {
        const nombreTexto = event.target.value.trim(); // Trim elimina los espacios en blanco que puedan ingresar al inicio y al final del input

        if(nombreTexto == "" || nombreTexto.length < 3) {
            mostrarAlerta("Nombre no Valido", "error")
        } else {
            const alerta = document.querySelector(".alerta"); // Elimina el mensaje de error al pasar la validacion en el formulario
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    const alertaPrevia = document.querySelector(".alerta"); //Hace que solo se muestre una vez la alerta
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if(tipo == "error") {
        alerta.classList.add("error");
    }

    const formulario = document.querySelector(".formulario");
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener("input", event => {
        const dia = new date(event.target.value).getUTCDay();

        if([0, 6].includes(dia)) {
            event.preventDefault();
            fechaInput.value = "";
            mostrarAlerta("Fines de Semana no Atendemos", "error");
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita);
        }
    });
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector("#fecha");
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", event => {
        const horaCita = event.target.value;
        const hora = horaCita.split(":"); // Permite dividir el string de la hora en dos a traves de los :

        if(hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta("Hora no Valida", "error");
            
            setTimeout(() => {
                inputHora.value = "";
            }, 3000);
        } else {
        cita.hora = horaCita;
        console.log(cita);
        }
    });
}