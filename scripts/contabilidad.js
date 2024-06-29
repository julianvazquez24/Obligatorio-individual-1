document.addEventListener("DOMContentLoaded", documentOnLoad);

const GASTOS = []

const NIVELES_GASTO = [
    {
      nombre: "Super Ahorro",
      margen: 0.1
    },
    {
      nombre: "Promedio",
      margen: 0.3
    },
    {
      nombre: "YOLO",
      margen: 0.6
    }
];
  
function guardarGastosEnStorage () {
    localStorage.setItem("gastos", JSON.stringify(GASTOS))
}

function traerGastosStorage () {
    return JSON.parse(localStorage.getItem("gastos")) || [ ];
}

function ultimoIdGasto() {
    let ultimoId= -1;
    for( let gasto of GASTOS) {
        if(gasto.id > ultimoId) {
            ultimoId = gasto.id;
        }
    }
    return ultimoId;
}

function agregarGasto(gasto) {
    gasto.id = ultimoIdGasto() + 1;
    GASTOS.push(gasto);
    //guarda el gasto
    guardarGastosEnStorage();
}

function eliminarGasto(idgasto) {
    let indice = buscarIndiceGasto (idgasto);
    if (indice !== -1) {
        GASTOS.splice(indice, 1);
        // se modifica el array de juegos
        guardarGastosEnStorage();
    }   
}

function cargarGastos(gastos) {
    for (let gasto of gastos) {
        agregarGasto(gasto)
    }
}

function buscarGastos(idgasto) {
    for (let i = 0; i < GASTOS.length; i++) {
      if (GASTOS[i].id == idgasto) {
        return GASTOS[i];
      }
    }
    return null;
}

function buscarIndiceGasto (idgasto) {
    for (let i=0 ; i < GASTOS.length ; i++) {
        if (GASTOS[i].id == idgasto) {
            return i;
        }
    }
   //devuelve -1 si no encuentra el gasto
    return -1;
}


function crearGastosTabla(gasto) {
    fila = document.createElement("tr");
    fila.dataset.idgasto = gasto.id;

    
    celdaGasto = document.createElement("td");
    celdaGasto.innerText = gasto.concepto;
    fila.appendChild(celdaGasto);

    celdaTipo =document.createElement("td");
    celdaTipo.innerText = gasto.tipo;
    fila.appendChild(celdaTipo);

    

    celdaMonto = document.createElement("td");
    celdaMonto.innerText = `$${gasto.monto}`;
    fila.appendChild(celdaMonto); 

    celdaFecha = document.createElement("td");
    celdaFecha.innerText = gasto.fecha.getDate() + "/" +gasto.fecha.getMonth() + "/" + gasto.fecha.getFullYear();
    fila.appendChild(celdaFecha);

    celdaAccion = document.createElement("td");
    divBtnAccion = document.createElement("div");

    botonEliminar = document.createElement("button");
    botonEliminar.innerText = "Eliminar";
    botonEliminar.addEventListener("click", onClickBotonEliminar);
   
    divBtnAccion.appendChild(botonEliminar);  
    celdaAccion.appendChild(divBtnAccion);

    fila.appendChild(celdaAccion)
    

    return fila;
}

function renderizarGastosTabla() {
    const tablaGastos = document.getElementById("tabla-gastos");
    tablaGastos.innerHTML = "";
    let fila;
    for (let gasto of GASTOS) {
       fila = crearGastosTabla(gasto);
       tablaGastos.appendChild(fila);
    }
}


function onClickBotonCancelar(evento) {
    evento.preventDefault();
    limpiarFormulario();
}


function onClickBotonGuardar(evento){
    evento.preventDefault();

    const inputConcepto = document.getElementById('concepto-form');
    const selectTipo = document.getElementById('tipo-gasto')
    const inputMonto = document.getElementById('monto-gasto');
    
    
    
    const concepto = inputConcepto.value;
    const tipo = selectTipo.value;
    const monto = parseInt(inputMonto.value);
    const fecha= new Date();
    
    
    if (concepto === "" || monto ==="" || tipo === "") {
        alert("Se requiere que todos los campos estén llenos");
        return;
    }
    
    agregarGasto({ concepto, tipo, monto, fecha});

    
    limpiarFormulario();
    renderizarGastosTabla();
    calcularTotalCasual();
    calcularTotalFijo();
    calcularTotalEmergencia();
    calcularTotalGastos();
}

function onClickBotonEliminar (evento){
    let idgasto = evento.target.closest("tr").dataset.idgasto;
   eliminarGasto(idgasto);
   renderizarGastosTabla();
}

function limpiarFormulario() {
    document.getElementById("concepto-form").value = "";
    document.getElementById("tipo-gasto").value = "";
    document.getElementById("monto-gasto").value = "";
}


function documentOnLoad() {
    document.getElementById("boton-cancelar")
    .addEventListener("click", onClickBotonCancelar);
    document.getElementById("boton-guardar")
    .addEventListener("click", onClickBotonGuardar);
    document.getElementById("boton-enviar")
    .addEventListener("click", onClickBotonEnviar);


    cargarGastos(traerGastosStorage);
    


    renderizarGastosTabla();
    
}

//para guardar ingreso mensual y plan de ahorro

function onClickBotonEnviar (){
    let inputIngresoMensual = document.getElementById("ingreso-mensual");
    let selectAhorro = document.getElementById("modo-ahorro");

    const ingreso = inputIngresoMensual.value;
    const ahorro =selectAhorro.value;
  
    nuevoPlan(ingreso, ahorro);

    limpiarFormAhorro();

}

function nuevoPlan(ingreso, ahorro){
    let textoPlan = document.getElementById("IngresoMensualSeleccionado");
    let textoAhorro = document.getElementById("planAhorroSeleccionado");
    let textoPlanEstadisticas = document.getElementById("ingreso-mensual-estadisticas");

    textoPlan.innerHTML = ingreso;
    textoAhorro.innerHTML = ahorro;
    textoPlanEstadisticas.innerHTML = "Ingreso Mensual: $" + ingreso;
}

function limpiarFormAhorro (){
    document.getElementById("ingreso-mensual").value = "";
    document.getElementById("modo-ahorro").value = "";

}

function calcularTotalCasual() {
    const totalCasual = traerGastosStorage()
     //el.filter busca dentro de gastos solo los que tienen un tipo "casual" y crea un array con esos gastos
    .filter(gasto => gasto.tipo === "casual")
    //.reduce suma los montos de los gastos casuales
    // acc es el acumulador que arranca en 0 y gasto.monto es lo que se le va sumando
    .reduce((acc, gasto) => acc + gasto.monto, 0);
    //Muestra el total de gastos casuales en el <span> del html
    

    document.getElementById("total-gastos-casuales").textContent = totalCasual;
}


//ahora hacemos lo mismo pero para los gastos fijos
function calcularTotalFijo() {
    const totalFijo = traerGastosStorage()
    
    .filter(gasto => gasto.tipo === "fijo")   
    .reduce((acc, gasto) => acc + gasto.monto, 0);
    
    document.getElementById("total-gastos-fijos").textContent = totalFijo;
}

//y lo  mismo con los de emergencia
function calcularTotalEmergencia() {
    const totalEmergencia = traerGastosStorage()
    
    .filter(gasto => gasto.tipo === "emergencia")   
    .reduce((acc, gasto) => acc + gasto.monto, 0);
    
    document.getElementById("total-gastos-emergencia").textContent = totalEmergencia;
}

//para los gastos del ultimo mes entran todos porque la fecha va a ser siempre la misma 

function calcularTotalGastos(){
    const gastos = traerGastosStorage();
    const totalGastosMes = gastos
        .reduce((acc, gasto) => acc + gasto.monto, 0);
    document.getElementById("total-gastos-mes").textContent = totalGastosMes;
}
