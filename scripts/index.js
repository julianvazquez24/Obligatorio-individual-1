// document.addEventListener(click, onclickLlevarAPagina)
// function onclickLlevarAPagina(){
//     document.getElementById("irPagina")
//     window.location.href= "contabilidad.html"

// }


document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('irPagina');
    button.addEventListener('click', () => {
        window.location.href = './pages/contabilidad.html';
        });

});
