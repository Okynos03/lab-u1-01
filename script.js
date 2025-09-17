// Seleccionamos el botón por su ID
const button = document.getElementById("colorButton");
// Creamos un arreglo con algunos colores
const colors = ["#f4f4f4", "#ffcccc", "#ccffcc", "#ccccff", "#ffffcc"];
// Variable para llevar el control del color actual
let index = 0;
// Agregamos un evento "click" al botón
button.addEventListener("click", function() {
    // Cambiamos el color de fondo del body
    document.body.style.backgroundColor = colors[index];
    // Avanzamos al siguiente color
    index++;
    // Si llegamos al final del arreglo, regresamos al inicio
    if (index >= colors.length) {
    index = 0;
    }
    }
);

const members = [{name:"Ulises", photo:"images/ulises.jpeg", desc:"holaaaa"},
    {name:"Milo", photo:"images/milo.jpeg", desc:"adioooss"}
]

let jindex = 0;

const card   = document.getElementById("member-section");
const nameEl = document.getElementById("member-name");
const imgEl  = document.getElementById("alumnoImages");
const descEl = document.getElementById("member-desc");

document.getElementById("nextParticipant").addEventListener("click", function () {
  const next = (jindex + 1) % members.length;

  // salida breve
  card.classList.add("swapping");

  setTimeout(() => {
    // cambio de contenido
    nameEl.textContent = members[next].name;
    imgEl.src          = members[next].photo;
    descEl.textContent = members[next].desc;
    jindex = next;

    // entrada
    card.classList.remove("swapping");
  }, 180);
});


function getTime(){
    actualDate = new Date()
    hour = actualDate.getHours()
    min = actualDate.getMinutes()
    seconds = actualDate.getSeconds()

    var time = hour + " : " + min + " : " + seconds

    document.form_reloj.reloj.value = time;
    setTimeout(getTime, 1000)
}

//muestra al primer biembro al cargar la pagina
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("member-name").textContent = members[jindex].name;
    document.getElementById("alumnoImages").src = members[jindex].photo;
    document.getElementById("member-desc").textContent = members[jindex].desc;
});