/* CREACION DE ARRAYS*/
// var arrayPalabras = ["DOMINIO", "HAMBURGUESA", "MANDO", "CROQUETA", "HERRAMIENTA",
//     "BOLIGRAFO", "MOCHILA", "ROBOT", "QUEMAR", "PATADA", "ROMPEDORA", "RAQUETA", "ZARIGUEYA", "MAQUETA",
//     "MONTACARGA", "PARCELA", "PARCIAL", "MANCHA", "LLAVERO", "ESTUCHE", "LONCHERA", "ACTRIZ", "MERETRIZ",
//     "HEXAGONO", "HAZAÑA", "ARAÑAR", "BIBLIOTECA", "MERENDAR", "BARRICADA", "CABALLERO", "CALCULADORA", "MANZANA"];

var lineas = [];
fetch('TEXTO/palabras.txt')
    .then(res => res.text())
    .then(content => {
        lineas = content.split(/\n/);
        // console.log("long: " + lineas.length);
    });

var letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
letras = letras.split("");

/*CREACIÓN DE VARIABLES*/
var palabra;
var numVida = 100;
var numPistas = 0;
var elemPist;
var efectoSonido = document.createElement("audio");
var apu = document.createElement("audio");
var goku = document.createElement("audio");
var sonido = document.createElement("audio");

const palFinal = document.createElement("p");
palFinal.className = "palabra";

/* AGREGAMOS LOS EVENTOS A LAS DIFERENTES SECCIONES DEL HTML Y CREAMOS LA PALABRA*/
window.onload = function () {
    document.getElementById("inicio").addEventListener("click", accionMenu);
    document.getElementById("reglas").addEventListener("click", accionMenu);
    document.getElementById("jugar").addEventListener("click", accionMenu);
    document.getElementById("pista").addEventListener("click", pista);
    elemPist = document.getElementById("numPista");
    document.documentElement.addEventListener("mousemove", func);
    window.addEventListener("resize", compTam);

    document.getElementsByClassName("fondo")[0].style.animation = "agrandar 0s normal 0s forwards";
    document.getElementsByClassName("menu")[0].style.animation = "colorArriba 0s reverse 0s backwards";

    /* MUSICA DE FONDO */
    sonido.setAttribute("src", "SONIDOS/Los Simpson - Intro.mp3");
    sonido.loop = true;
    document.body.appendChild(sonido);
    sonido.play();
    sonido.volume = .2;

    crearBotones();
    compTam();
}

function func(e) {
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

    stopMusica();
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
        iniciaJuego();
        secJ.classList.remove("ocultar");
        secR.classList.add("ocultar");
    }

}

/*  RECIBE UNA PALABRA COMO PARAMETRO Y LA AÑADE AL DOCUMENTO HTML
    MEDIANTE EL OBJETO CON ID "contPalabra"
*/
function creaPalabra() {
    palabra = lineas[parseInt(Math.random() * (lineas.length - 0) + 0)];

    palFinal.id = palabra;
    palFinal.innerText = "";
    for (let i = 0; i < palabra.length; i++) {
        palFinal.innerText += "_";
    }
    document.getElementById("contPalabra").appendChild(palFinal);
}

/*COMPRUEBA SI LA LETRA QUE SE HA PULSADO ES CORRECTA, RECIBE COMO PARAMETRO LA LETRA PULSADA*/
function comprobarLetra(e) {
    if (e != "[object PointerEvent]") {
        var pulsada = e.key.toUpperCase();
    }
    else {
        var pulsada = this.id;
        this.style.opacity = 0;
        this.disabled = true;
    }


    /*EN EL CASO DE QUE LAS LETRAS ESTEN ENTRE LAS INCLUIDAS Y NO SE HAYA PULSADO ANTES, ENTRA EN LA CONDICIÓN*/
    if (letras.includes(pulsada) && !letrasAdiv.includes(pulsada)) {

        /*ELIMINAMOS LA ANIMACION DE DE PARPADEO QUE OCURRE CUANDO 
           SE LA LETRA PULSADA NO ESTÁ EN LA PALABRA*/
        document.getElementById(palabra).classList.remove("letMal");

        if (!comparacion(pulsada)) {
            /*VARIABLE QUE RECOGE EL ELEMENTO DONDE SE ESCRIBEN EN EL HTML LAS LETRAS PULSADAS*/
            const adiv = document.getElementById("letAdivinadas");
            if (adiv.innerText.length > 0) {
                adiv.innerText += ",";
            }

            /*ESCRIBIMOS LA LETRA PULSADA EN EL HTML*/
            adiv.innerText += "  " + pulsada;

            /*LLAMAMOS A LA FUNCION QUITAR VIDA QUE DEVUELVE TRUE EN CASO DE QUE NO QUEDE MÁS VIDA*/
            if (quitarVida()) {
                playMusica("CancionNaruto.mp3");
                apu.setAttribute("src", "SONIDOS/apu.mp3");
                document.body.appendChild(apu);
                apu.play();
                /*TRAS FINALIZAR LA PARTIDA LLAMAMOS A MOSTRAR FIN Y LE PASAMOS UN TEXTO Y UNA IMAGEN*/
                mostrarFin("YOU LOSE", "https://i.pinimg.com/originals/a0/b7/18/a0b718b32a4786699a562ffaff9a5f52.gif",
                    "https://gifimage.net/wp-content/uploads/2017/09/bart-simpson-gif-14.gif");
            }
        }

        /*CUANDO YA SE HAN ACERTADO TODAS LAS LETRAS LLAMAMOS A MOSTRAR FIN*/
        if (palFinal.innerText == palabra) {
            playMusica("VictoriaInazuma.mp3");
            goku.setAttribute("src", "SONIDOS/CristoRey.mp3");
            document.body.appendChild(goku);
            goku.play();
            mostrarFin("YOU WIN", "https://i.pinimg.com/originals/a9/24/09/a92409589f083b5911c59084d7c61a11.gif"
                , "https://www.chiquipedia.com/images/gifs-bart-simpson.gif");
        }

    }

}

/* FUNCION QUE BUSCA LA LETRA QUE SE HA PULSADO, SI LA ENCUENTRA, INTERCAMBIA EL "_", POR LA LETRA*/
function comparacion(letra) {
    var cond = false;
    letrasAdiv.push(letra);

    for (let i = 0; i < palabra.length; i++) {
        if (palabra.charAt(i) == letra) {
            palFinal.innerText = palFinal.innerText.substr(0, i) + letra + palFinal.innerText.substr(i + 1, palabra.length);
            cond = true;
        }
    }

    /*SE AGREGA LA PALABRA MODIFICADA (O SIN MODIFICAR) AL HTML*/
    document.getElementById("contPalabra").appendChild(palFinal);

    return cond;
}


/*FUNCION QUE REDUCE LA BARRA DE VIDA, EN CASO DE NO TENER MÁS VIDA, DEVUELVE FALSE*/
function quitarVida() {
    playMusica("Ayy_Caramba.mp3");

    numVida -= 16.66;
    var fin = false;
    /*AÑADIMOS ANIMACION DE PARPADEO DE LA LETRA*/
    document.getElementById(palabra).classList.add("letMal");

    /*MUEVE LA IMAGEN DE HOMER CORRIENDO HACIA LA DERECHA */
    document.getElementById("homer").style.paddingLeft = 80 - numVida + "%";

    /*GUARDAMOS ELE ELEMENTO DE LA BARRA DE VIDA*/
    const vida = document.getElementById("barraVida");

    /*RESTAMOS LA CANTIDAD DE VIDA Y AGREGAMOS EL CAMBIO AL ELEMENTO*/
    vida.style.backgroundPosition = numVida + "%";

    /*EN EL CASO DE QUE QUEDEN DOS FALLOS AGREGAMOS OTRA ANIMACION DE PARPADEO
    INFINITO A LA BARRA DE VIDA*/
    if (numVida < 60) {
        vida.classList.add("parp");
    }

    /*SI LA VIDA ES MENOR QUE 0 FIN SE CONVIERTE EN TRUE Y SE PASA COMO PARAMETRO*/
    if (numVida < 0) {
        fin = true;
    }

    return fin;
}

/*SE LE PASA LA EL TEXTO DE VICTORIA O DERROTA Y LA IMAGEN*/
function mostrarFin(texto, imagen, imagen2) {
    sonido.pause();
    document.getElementsByTagName("body")[0].removeEventListener("keyup", comprobarLetra);
    var secF = document.getElementById("secF");

    /*MOSTRAMOS LA SECCION FINAL Y OCULTAMOS EL RESTO DE BLOQUES*/
    secF.classList.remove("ocultar");
    secJ.classList.add("ocultar");
    secR.classList.add("ocultar");

    var h1 = document.getElementById("titF");
    var h3 = document.getElementById("subF");
    var img = document.getElementById("imgF");
    var img2 = document.getElementById("imgF2");

    h1.innerText = texto;
    h3.innerText = "La Palabra era: " + palabra;
    img.src = imagen;
    img2.src = imagen2

}

/*FUNCION QUE REINICA EL JUEGO Y TODAS LAS VARIABLES, TRAS FINALIZAR*/
function iniciaJuego() {
    /*CREA UNA NUEVA PALABRA */
    creaPalabra();
    numPistas = parseInt(palabra.length / 3);
    document.getElementById("numPistas").innerText = "PISTAS: " + numPistas;

    /*DETIENE LA MUSICA DE LA SECCION DE FONDO E INICIA LA CANCION DE LA INTRO DE LOS SIMPSON */
    stopMusica();
    sonido.play();
    /*QUITA LAS ANIMACIONES*/
    document.getElementById(palabra).classList.remove("letMal");
    document.getElementById("barraVida").classList.remove("parp");

    /*QUITA EL EVENTO DE TECLA PARA QUE MIENTRAS SE NAVEGUE POR EL RESTO DE LA PAGINA 
    NO SE ESTE LLAMANDO AL EVENTO*/
    document.getElementsByTagName("body")[0].addEventListener("keyup", comprobarLetra);

    /*REINICIO DE VARIABLES*/
    document.getElementById("letAdivinadas").innerText = "";
    letrasAdiv = [];
    numVida = 100;
    document.getElementById("barraVida").style.backgroundPosition = numVida + "%";
    document.getElementById("pista").style.opacity = 1;
    document.getElementById("pista").addEventListener("click", pista);
    document.getElementById("numPistas").style.display = "block";
    document.getElementById("homer").style.paddingLeft = 0;

    const bot = document.getElementsByTagName("button");
    for (let i = 0; i < bot.length; i++) {
        bot[i].disabled = false;
        bot[i].style.opacity = 1;
    }
}

/* SE DA UNA PISTA AL USUARIO. EL NUMERO DE PISTAS VARÍA EN FUNCION DE LA LONGITUD DE LA PALABRA*/
function pista() {
    playMusica("wow.mp3");
    document.getElementById(palabra).classList.remove("letMal");
    let aux = 0;

    while (palFinal.innerText.charAt(aux) != "_") {
        aux = [parseInt(Math.random() * (palabra.length - 0) + 0)];
    }

    comparacion(palabra.charAt(aux));

    if (palFinal.innerText == palabra) {
        mostrarFin("YOU WIN", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/1200px-Check_green_icon.svg.png");
    }

    numPistas--;
    document.getElementById("numPistas").innerText = "PISTAS: " + numPistas;

    if (numPistas <= 0) {
        this.style.opacity = 0;
        this.removeEventListener("click", pista);
        document.getElementById("numPistas").style.display = "none";
    }
}

/* REPRODUCE LA MUSICA QUE SE LE PASE COMO PARAMETRO */
function playMusica(mus) {
    stopMusica();

    try {
        efectoSonido.setAttribute("src", "SONIDOS/" + mus);
        document.body.appendChild(efectoSonido);
        efectoSonido.play();
    } catch (error) {
    }
}

/* DETIENE LA MUSICA QUE SE ESTÉ REPRODUCIENDO EN ESE MOMENTO EN LA VARIABLE */
function stopMusica() {
    efectoSonido.pause();
}

/* COMPRUEBA EL TAMAÑO DE LA VENTANA CUANDO SE CAMBIA EL TAMAÑO */
function compTam() {
    if (window.innerWidth < 500) {
        mostrarBotones();
    }
    else {
        escondeBotones();
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
    }

}

/* MOSTRAR LA INTERFAZ DE BOTONES */
function mostrarBotones() {
    for (let i = 0; i < letras.length; i++) {
        const button = document.getElementById(letras[i]);
        if (button != null) {
            button.style.display = "inline";
        }
    }
}

/* ELIMINA LA INTERFAZ DE BOTONES */
function escondeBotones() {
    for (let i = 0; i < letras.length; i++) {
        const button = document.getElementById(letras[i]);
        if (button != null) {
            button.style.display = "none";
        }
    }
}

