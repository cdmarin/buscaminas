import Jugar from "./scriptJuego.js";
/* LEEMOS EL FICHERO Y EXTRAEMOS LAS PALABRAS LINEA A LINEA Y LAS METEMOS EN EL ARRAY*/
var lineas = [];
fetch('TEXTO/palabras.txt')
    .then(res => res.text())
    .then(content => {
        lineas = content.split(/\n/);
    });

/* CREACION DE ARRAYS*/

var letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
var jugar;
/*CREACIÓN DE VARIABLES*/
var sonido = document.createElement("audio");
var existeBoton;
var mostBoton = false;

const palFinal = document.createElement("p");
palFinal.className = "palabra";

/* AGREGAMOS LOS EVENTOS A LAS DIFERENTES SECCIONES DEL HTML Y CREAMOS LA PALABRA*/
window.onload = function () {
    document.getElementById("pista").addEventListener("click", pista);
    document.getElementById("inicio").addEventListener("click", accionMenu);
    document.getElementById("reglas").addEventListener("click", accionMenu);
    document.getElementById("jugar").addEventListener("click", accionMenu);
    document.getElementById("mostBotones").addEventListener("click", eventoBoton);
    document.getElementsByClassName("fondo")[0].style.animation = "agrandar 0s normal 0s forwards";
    document.getElementsByClassName("menu")[0].style.animation = "colorArriba 0s reverse 0s backwards";


    document.documentElement.addEventListener("mousemove", posRaton);

    /*AGREGAMOS LOS SONIDOS*/
    var efectoSonido = document.createElement("audio");
    efectoSonido.id = "efectoSonido";
    document.body.appendChild(efectoSonido);

    var apu = document.createElement("audio");
    apu.id = "apu";
    apu.setAttribute("src", "SONIDOS/apu.mp3");
    document.body.appendChild(apu);

    var goku = document.createElement("audio");
    goku.id = "goku";
    goku.setAttribute("src", "SONIDOS/CristoRey.mp3");
    document.body.appendChild(goku);



    /* MUSICA DE FONDO */
    sonido.setAttribute("src", "SONIDOS/Los Simpson - Intro.mp3");
    sonido.loop = true;
    sonido.id = "sonido";
    document.body.appendChild(sonido);
    sonido.play();
    sonido.volume = .2;



    existeBoton = false;

}

function posRaton(e) {
    var mousex = e.pageX;
    var mousey = e.pageY;
    var img = document.getElementById("raton");

    img.style.top = mousey + 5 + "px";
    img.style.left = mousex - 70 + "px";

}

/* RECOGE ESTAS DOS FUNCIONES, PRIMERO HACE PEQUEÑO O GRANDE EL TITULO PRINCIPAL
   Y DESPUES OCULTA O MUESTRA EL BLOQUE SELECCIONADO
*/

function accionMenu() {

    sonido.play();
    alternarInicio(this);
    alternarBloque(this);
}

/* FUNCION PARA ALTERNAR ENTRE LA PANTALLA DE INICIO Y LOS DEMÁS BLOQUES, 
   AGREGA LA ANIMACION DE HACER GRANDE O PEQUEÑO EL MENU. RECIBE COMO 
   PARAMETRO EL ELEMENTO DEL MENU PULSADO
*/
function alternarInicio(elem) {
    const imgFondo = document.getElementsByClassName("fondo")[0];
    const menu = document.getElementsByClassName("menu")[0];

    if (elem.id != "inicio") {
        menu.classList.remove("abajo");
        imgFondo.style.animation = "peque 1s normal 0s forwards";
        menu.style.animation = "colorArriba 2s normal 0s forwards";
    }
    else {
        menu.classList.add("abajo");
        imgFondo.style.animation = "agrandar 1s normal 0s forwards";
        menu.style.animation = "colorArriba 2s reverse 0s backwards";
    }
}

/*  ALTERNA ENTRE LOS BLOQUES DE JUGAR Y REGLAS
    SI SE SELECCIONA MENU SE OCULTAN LOS DOS,
    EN EL CASO DE SER OTRO, ESTE SE MUESTRA Y LOS DEMÁS SE OCULTAN
*/
function alternarBloque(elem) {
    document.getElementById("secF").classList.add("ocultar");

    if (elem.id == "inicio") {
        /*QUITA EL EVENTO DE TECLA PARA QUE MIENTRAS SE NAVEGUE POR EL RESTO DE LA PAGINA 
        NO SE ESTE LLAMANDO AL EVENTO*/
        document.getElementsByTagName("body")[0].removeEventListener("keyup", comprobarLetra);
        secJ.classList.add("ocultar");
        secR.classList.add("ocultar");

    }
    else if (elem.id == "reglas") {
        /*QUITA EL EVENTO DE TECLA PARA QUE MIENTRAS SE NAVEGUE POR EL RESTO DE LA PAGINA 
        NO SE ESTE LLAMANDO AL EVENTO*/
        document.getElementsByTagName("body")[0].removeEventListener("keyup", comprobarLetra);
        secR.classList.remove("ocultar");
        secJ.classList.add("ocultar");

    }
    else {
        document.getElementsByTagName("body")[0].addEventListener("keyup", comprobarLetra);

        jugar = new Jugar(palFinal, lineas);
        secJ.classList.remove("ocultar");
        secR.classList.add("ocultar");
    }

}

/*COMPRUEBA SI LA LETRA QUE SE HA PULSADO ES CORRECTA, RECIBE COMO PARAMETRO LA LETRA PULSADA*/
function comprobarLetra(e) {
    if (e != "[object PointerEvent]") {
        var pulsada = e.key.toUpperCase();
        if (document.getElementById(pulsada) != null) {
            document.getElementById(pulsada).style.opacity = 0;
            document.getElementById(pulsada).style.disabled = true;
        }

    }
    else {
        var pulsada = this.id;
        this.style.opacity = 0;
        this.disabled = true;
    }

    jugar.comprobarLetra(pulsada);

}

function pista() {
    if (jugar.pista()) {
        this.style.opacity = 0;
        this.removeEventListener("click", pista);
        document.getElementById("numPistas").style.display = "none";
    }
}


/* COMPRUEBA EL TAMAÑO DE LA VENTANA CUANDO SE CAMBIA EL TAMAÑO */
function eventoBoton() {
    if (!existeBoton) {
        crearBotones();
        existeBoton = true;
    }

    if (!mostBoton) {
        mostrarBotones();
        mostBoton = true;
    }
    else {
        escondeBotones();
        mostBoton = false;
    }
}

/* CREA LA INTERFAZ DE BOTONES */
function crearBotones() {
    for (let i = 0; i < letras.length; i++) {
        const button = document.createElement('button');
        button.className = "button";
        button.id = letras[i];
        button.innerHTML = letras[i];
        document.getElementById("botones").appendChild(button);
        button.addEventListener("click", comprobarLetra);

        if (jugar.getLetrasAdiv().includes(letras[i])) {
            button.disabled = true;
            button.style.opacity = 0;
        }
    }

}

/* MOSTRAR LA INTERFAZ DE BOTONES */
function mostrarBotones() {
    document.getElementById("letAdivinadas").style.display = "none";
    for (let i = 0; i < letras.length; i++) {
        const button = document.getElementById(letras[i]);
        if (button != null) {
            button.style.display = "inline";
        }
    }
}

/* ELIMINA LA INTERFAZ DE BOTONES */
function escondeBotones() {
    document.getElementById("letAdivinadas").style.display = "block";
    for (let i = 0; i < letras.length; i++) {
        const button = document.getElementById(letras[i]);
        if (button != null) {
            button.style.display = "none";
        }
    }
}

