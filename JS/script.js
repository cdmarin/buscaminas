import { empiezaCables, empiezaAsteroides } from "./miniJuego.js";

// VARIABLES
var longTabla = 11;
var numImpostores = 15;
var numMarcas = numImpostores;
var efecSonido = document.createElement("audio");
var sonido = document.createElement("audio");
var efecS = true;
var reloj;
var primera = true;
var numpistas = 1;
var auxNumPistas;
var boolPista = false;

// ARRAYS
var blanco = [];
var impostores = [];
var pulsadas = [];

window.onload = () => {
    // CREACION DE EVENTOS Y DE TABLA
    creaTabla();
    document.getElementById("bInicio").addEventListener("click", pantJuego);
    document.getElementById("reset").addEventListener("click", resetearJuego);
    document.getElementById("reglas").addEventListener("click", mostReglas);
    document.getElementById("about").addEventListener("click", about);
    document.getElementById("ini").addEventListener("click", volverInicio);


    // EVENTO DE CAMBIO DE DIFICULTAD
    var dificultad = document.getElementsByClassName("dif");
    for (let i = 0; i < 4; i++) {
        dificultad[i].addEventListener("click", cambiarDificultad);
    }

    // BAJAR O SUBIR EL VOLUMEN DE LA MUSICA
    document.getElementById("efecS2").addEventListener("mousemove", bajarMusica);
    document.getElementById("musF2").addEventListener("mousemove", bajarMusica);


    // EVENTO DE PARAR Y REPRODUCIR LA MÚSICA
    document.getElementById("efecS").addEventListener("click", (e) => {
        mutearMusica(document.getElementById(e.target.id));
        e.stopPropagation();
    });
    document.getElementById("musF").addEventListener("click", (e) => {
        mutearMusica(document.getElementById(e.target.id));
        e.stopPropagation();
    });

    // MUSICA DE FONDO
    sonido.src = "SONIDOS/musFondo.mp3";
    sonido.loop = true;
    sonido.volume = 1;
    sonido.play();

}

// CREA LA TABLA CON LA LONGITUD ESPECIFICADA
function creaTabla() {
    for (let y = 0; y < longTabla; y++) {
        var tr = document.createElement("tr");

        tr.id = "tr" + y;
        for (let x = 0; x < longTabla; x++) {
            var td = document.createElement("td");
            td.id = y + "-" + x;
            td.innerHTML = " ";
            tr.appendChild(td);

        }

        document.getElementById("tablaMina").appendChild(tr);
    }
    creaMinas();

}

// CREACION DE MINAS
function creaMinas() {
    for (let i = 0; i < numImpostores; i++) {

        var pos = parseInt(Math.random() * (longTabla - 0) + 0) + "-" + parseInt(Math.random() * (longTabla - 0) + 0);

        var impo = new Map();
        impo.set(pos, true);

        if (!impostores.includes(pos)) {
            impostores[i] = pos;
        }
        else {
            i--;
        }
    }

    // ORDENA EL ARRAY PARA QUE AL MOSTRAR AL FINAL DE LA PARTIDA, SE MUESTRE ORDENADAMENTE
    for (let i = 1; i < impostores.length; i++) {
        var y1 = parseInt(impostores[i - 1].split("-")[0]);
        var x1 = parseInt(impostores[i - 1].split("-")[1]);
        var y2 = parseInt(impostores[i].split("-")[0]);
        var x2 = parseInt(impostores[i].split("-")[1]);

        if (y1 > y2) {
            impostores[i - 1] = y2 + "-" + x2;
            impostores[i] = y1 + "-" + x1;
            i = 0;
        }
        else if (y1 == y2) {
            if (x1 > x2) {
                impostores[i - 1] = y2 + "-" + x2;
                impostores[i] = y1 + "-" + x1;
                i = 0;
            }
        }
    }

}

// EN EL CASO DE SER EL PRIMER EL PRIMER CLICK DE LA PARTIDA, OBLIGA A QUE SIEMPRE SE DE EN UN BLANCO
function primeraVacio(posY, posX) {
    while (getnumImpostores(posY, posX) >= 1) {
        impostores = [];
        creaMinas();
    }

    primera = false;
}

// OBTIENE EL NUMERO DE IMPOSTORES ALREDEDOR
function getnumImpostores(posY, posX) {
    posY--;
    posX--;
    var num = 0;
    // y. 6 --> 5
    // x. 3 --> 2
    for (let y = posY; y <= posY + 2; y++) {

        for (let x = posX; x <= posX + 2; x++) {
            if (document.getElementById(y + "-" + x) && impostores.includes(y + "-" + x)) {
                num++;
            }
        }
    }

    return num;
}


//COMPRUEBA SI HAY UNA MINA EN LA CASILLA PULSADA
function comprobarMina(elem) {
    if (this) {
        elem = this;
    }

    // SI NO SE HA PULSADO ANTERIORMENTE, COMPRUEBA LAS MINAS ALREDEDOR
    if (!pulsadas.includes(elem.id)) {
        if (primera) {
            primeraVacio(parseInt(elem.id.split("-")[0]), parseInt(elem.id.split("-")[1]));
        }

        // SI ES UNA MINA
        if (!impostores.includes(elem.id)) {
            var posY = parseInt(elem.id.split("-")[0]);
            var posX = parseInt(elem.id.split("-")[1]);

            var impostAlrededor = getnumImpostores(posY, posX);

            pulsadas.push(elem.id);

            // SI NO TIENE MINAS ALREDEDOR
            if (impostAlrededor == 0) {
                muestraVacios(posY, posX);
                buscaCeros();
            }
            // SI TIENE MINAS ALREDEDOR
            else {
                playSonido("SONIDOS/muerte.mp3");
                if (elem.style.backgroundImage.includes("bandera")) {
                    numMarcas++;
                    document.getElementById("numImpostores").innerText = numMarcas;
                }
                elem.innerText = impostAlrededor;
                elem.style.backgroundImage = "url(IMG/cadaver.png)";
            }
        }
        // SI NO ES UNA MINA

        else {
            if (!boolPista) {
                terminarJuego("url(IMG/Derrota.jpg)", "lose");
            }
            else {
                elem.style.backgroundImage = "url(IMG/impostor.png)";
            }

        }

        // COMPRUEBA SI SE HAN PULSADO TODAS LAS CASILLAS QUE NO TIENEN MINAS
        var cond = true;
        for (let y = 0; y < longTabla; y++) {
            for (let x = 0; x < longTabla; x++) {
                if (!pulsadas.includes(y + "-" + x) && !impostores.includes(y + "-" + x)) {
                    cond = false;
                }
            }
        }
        // TERMINA LA PARTIDA EN VICTORIA
        if (cond) {
            terminarJuego("url(IMG/Victoria.jpg)", "win");
        }

        // TRAS PULSAR PISTA Y HABER MARCADO LA CASILLA DESEADA, VUELVE A PONER
        // EL TEXTO DE "Marque la casilla..." TRANSPARENTE
        if (boolPista) {
            document.getElementById("instrucciones").style.opacity = 0;
            boolPista = false;
        }
    }

}

//MUESTRAS LOS CAMPOS ALREDEDOR DE LAS QUE NO TENGAN MINAS CIRCUNDATES (AQUELLOS CON EL FONDO BLANCO)
function muestraVacios(posY, posX) {
    posY--;
    posX--;
    for (let y = posY; y <= posY + 2; y++) {
        for (let x = posX; x <= posX + 2; x++) {

            // SI EXISTE EL ELEMENTO DE LA TABLA
            if (document.getElementById(y + "-" + x)) {
                var impostAlrededor = getnumImpostores(y, x);

                // SI SE HA COLOCADO UNA BANDERA DEVUELVE LA BANDERA ELIMINADA
                if (document.getElementById(y + "-" + x).style.backgroundImage.includes("bandera")) {
                    numMarcas++;
                    document.getElementById("numImpostores").innerText = numMarcas;
                }

                // SI NO HAY MINAS ALREDEDOR CAMBIA EL COLOR
                if (impostAlrededor == 0) {
                    document.getElementById(y + "-" + x).style.backgroundColor = "rgba(255, 255, 255, 0.424)";
                    document.getElementById(y + "-" + x).style.backgroundImage = "";
                }
                // SI HAY MINAS ALREDEDOR COLOCA EL NUMERO
                else {
                    document.getElementById(y + "-" + x).innerText = impostAlrededor;
                    document.getElementById(y + "-" + x).style.backgroundImage = "url(IMG/cadaver.png)";
                }
                // GUARDAMOS LAS CASILLAS REVELADAS EN EL ARRAY PARA NO VOLVER A PULSAR MAS TARDE
                pulsadas.push(y + "-" + x);
            }
        }
    }
}

//BUSCA LOS CAMPOS SIN MINAS CERCA (AQUELLOS CON EL FONDO BLANCO)
function buscaCeros() {
    for (let y = 0; y < longTabla; y++) {
        for (let x = 0; x < longTabla; x++) {
            var elem = document.getElementById(y + "-" + x);

            // SI EL ELEMENTO NO TIENE MINAS ALREDEDOR MUESTRA LAS CASILLAS QUE LO RODEAN
            if (elem && elem.style.backgroundColor.includes("(255, 255, 255, 0.424)") && !blanco.includes(y + "-" + x)) {
                muestraVacios(y, x);

                // SE GUARDA EN UN ARRAY PARA QUE NO SE 
                blanco.push(y + "-" + x);

                // RETROCEDE 2 POSICIONES
                y -= 2;
                x = 0;
            }
        }
    }
}

//FUNCION PARA PONER MARCAS CON CLICK DERECHO
function ponerMarca() {
    // SI NO HAY UNA BANDERA, LA PONE Y RESTA EL NUMERO
    if (numMarcas > 0 && !pulsadas.includes(this.id) && !this.style.backgroundImage.includes("bandera")) {
        playSonido("SONIDOS/sabotaje.mp3");
        this.style.backgroundImage = "url(IMG/bandera.png)";
        numMarcas--;
    }
    // SI HAY UNA BANDERA, LA DEVUELVE
    else if (this.style.backgroundImage.includes("bandera")) {
        this.style.backgroundImage = "";
        numMarcas++;
    }

    document.getElementById("numImpostores").innerText = numMarcas;
}


//REESTABLECE LAS VARIABLES DEL JUEGO
function resetearJuego() {
    document.getElementById("instrucciones").style.opacity = 0;

    // REINICIO DE VARIABLES
    auxNumPistas = numpistas;
    primera = true;
    var seg = 0;
    var min = 0;
    document.getElementById("reloj").innerHTML = "00:00";
    clearInterval(reloj);
    clearInterval(most);

    // REINICIO DE ARRAYS
    blanco = [];
    impostores = [];
    pulsadas = [];
    numMarcas = numImpostores;

    // MOSTRAMOS EL JUEGO Y ESCONDEMOS EL RESTO
    document.getElementById("numPistas").innerText = auxNumPistas;
    document.getElementById("numImpostores").innerText = numImpostores;
    document.getElementById("contJuego").classList.remove("ocultar");
    document.getElementById("contJuego").classList.add("mostrar");
    document.getElementById("contReglas").classList.add("ocultar");
    document.getElementById("abAmong").classList.add("ocultar");

    document.getElementById("shh").style.opacity = 1;
    document.getElementById("shh").style.display = "block";
    playSonido("SONIDOS/shh.mp3");

    // VUELVE A DEJAR POR DEFECTO LAS CASILLAS DE LA TABLA
    for (let y = 0; y < longTabla; y++) {
        for (let x = 0; x < longTabla; x++) {
            document.getElementById(y + "-" + x).style.background = "";
            document.getElementById(y + "-" + x).innerHTML = " ";
            document.getElementById(y + "-" + x).style.transform = "";
        }
    }
    // ANIMACION AL EMPEZAR LA PARTIDA
    setTimeout(() => {
        document.getElementById("shh").style.opacity = 0;
    }, 2500);

    setTimeout(() => {
        document.getElementById("shh").style.display = "none";


        for (let y = 0; y < longTabla; y++) {
            for (let x = 0; x < longTabla; x++) {
                document.getElementById(y + "-" + x).addEventListener("click", comprobarMina);
                document.getElementById(y + "-" + x).addEventListener("contextmenu", ponerMarca);

                // QUITA EL CLICK DERECHO SOLO EN LA TABLA
                document.getElementById(y + "-" + x).oncontextmenu = () => {
                    return false;
                };
            }
        }

        document.getElementById("pista").addEventListener("click", pista);

        // ELIMINAMOS EL INTERVALO EN CASO DE QUE HAYA OTRA ANTES
        clearInterval(reloj);

        // INICIO DEL RELOJ
        reloj = setInterval(() => {

            seg++;
            if (seg == 60) {
                seg = 0;
                min++;
            }

            var mostrar = min + ":";

            if (min < 10) {
                mostrar = "0" + min + ":";
            }

            if (seg < 10) {
                mostrar += "0" + seg;
            }
            else {
                mostrar += seg;
            }

            document.getElementById("reloj").innerHTML = mostrar;
        }, 1000);
    }, 3800);

    creaMinas();
}



// CAMBIA LA DIFUICULTAD DE LA PARTIDA, CON ELLO, EL NUMERO DE MINAS  Y LONGITUD DE LA TABLA
function cambiarDificultad() {
    // BORRA LA TABLA PARA CREAR OTRA CON LA MDEDIDA NUEVA
    borrarTabla();

    switch (this.id) {
        case "fac":
            document.getElementById("actDif").innerHTML = "Facil";
            numImpostores = 15;
            longTabla = 11;
            numpistas = 1;
            break;
        case "med":
            document.getElementById("actDif").innerHTML = "Intermedio";
            numImpostores = 25;
            longTabla = 12;
            numpistas = 1;
            break;
        case "dif":
            document.getElementById("actDif").innerHTML = "Dificil";
            numImpostores = 35;
            longTabla = 14;
            numpistas = 2;
            break;
        case "exp":
            document.getElementById("actDif").innerHTML = "Experto";
            numImpostores = 50;
            longTabla = 15;
            numpistas = 3;
            break;
    }
    // CREA LA TABLA CON LA NUEVA LONGITUD
    creaTabla();

    // REINICIA EL JUEGO
    resetearJuego();

}

// ELIMINA LA TABLA PARA CREAR UNA NUEVA AL CAMBIAR DE DIFICULTAD
function borrarTabla() {
    for (let i = 0; i < longTabla; i++) {
        if (document.getElementById("tr" + i)) {
            document.getElementById("tr" + i).remove();
        }
    }
}



var most;
//TERMINA EL JUEGO
function terminarJuego(img, audio) {
    for (let y = 0; y < longTabla; y++) {
        for (let x = 0; x < longTabla; x++) {
            document.getElementById(y + "-" + x).removeEventListener("click", comprobarMina);
            document.getElementById(y + "-" + x).removeEventListener("contextmenu", ponerMarca);
        }
    }



    document.getElementById("pista").removeEventListener("click", pista);
    document.getElementById("numImpostores").innerText = 0;

    document.getElementById("final").classList.remove("ocultar");
    document.getElementById("final").classList.add("mostrar");
    document.getElementById("final").style.backgroundImage = img;
    playSonido("SONIDOS/" + audio + ".mp3");
    setTimeout(() => {
        document.getElementById("final").style.animation = "desaparecer 2s normal forwards";
    }, 4000);

    setTimeout(() => {
        document.getElementById("final").classList.add("ocultar");
        document.getElementById("final").classList.remove("mostrar");
        document.getElementById("final").style.animation = "";

        // INTERVALO QUE MUESTRA LOS IMPOSTORES PERIODICAMENTE, TERMINA CUANDO "i" ES IGUAL A LA LONGITUD DEL ARRAY DE IMPOSTORES
        var i = 0;
        if (img.toLowerCase().includes("derrota")) {
            most = setInterval(() => {
                if (i > 0) {
                    document.getElementById(impostores[i - 1]).style.transform = "";
                }

                if (i >= impostores.length) {
                    clearInterval(most);
                }
                else {
                    document.getElementById(impostores[i]).style.backgroundImage = "url(IMG/impostor.png)";
                    document.getElementById(impostores[i]).style.transform = "scale(200%)";
                    document.getElementById("numImpostores").innerText = i + 1;
                }
                i++;

            }, 200);
        }


    }, 5100);

    clearInterval(reloj);
}

// PROPORCIONA UNA PISTA AL USUARIO, QUE PODRÁ UTILIZAR AL TERMINAR EL MINIJUEGO
// LA PISTA PROPORCIONA INMUNIDAD, POR LO QUE AUN PULSANDO EN UNA MINA, EL JUGADOR NO PERDERÁ
function pista() {
    if (!pulsadas.includes(this.id) && auxNumPistas > 0) {
        boolPista = true;
        auxNumPistas--;
        document.getElementById("numPistas").innerText = auxNumPistas;
        document.getElementById("instrucciones").style.opacity = 1;

        document.getElementById("contJuego").classList.add("ocultar");

        // EMPIEZA EL MINIJUEGO, PARA SU ELECCION SE GENERA UN NUMERO RANDOM ENTRE 0 Y 1
        var numR = parseInt(Math.random() * (2 - 0) + 0);

        if (numR == 0) {
            document.getElementById("minCable").classList.remove("ocultar");
            document.getElementById("minCable").classList.add("mostrar");
            empiezaCables();
        }
        else if (numR == 1) {
            document.getElementById("minAsteroides").classList.remove("ocultar");
            document.getElementById("minAsteroides").classList.add("mostrar");
            empiezaAsteroides(sonido, efecSonido);
        }
    }

}

//OCULTA EL ELEMENTO QUE HAYA EN PANTALLA Y MUESTRA LAS REGLAS
function mostReglas() {
    document.getElementById("contJuego").classList.add("ocultar");
    document.getElementById("abAmong").classList.add("ocultar");
    document.getElementById("contReglas").classList.remove("ocultar");
    document.getElementById("contReglas").classList.add("mostrar");

}

//PERMITE VOLVER A LA PANTALLA DE INCIO
function volverInicio() {
    document.getElementById("inicio").classList.add("mostrar");
    document.getElementById("inicio").classList.remove("ocultar");

    document.getElementById("jugar").classList.add("ocultar");
    document.getElementById("jugar").classList.remove("mostrar");
}

//MUESTRAS EL JUEGO, SE EJECUTA AL PULSAR EN LA PANTALLA DE INICIO
function pantJuego() {
    document.getElementById("inicio").classList.remove("mostrar");
    document.getElementById("inicio").classList.add("ocultar");

    document.getElementById("jugar").classList.remove("ocultar");
    document.getElementById("jugar").classList.add("mostrar");

    resetearJuego();
}


// ABRE EL APARTADO DE ABOUT
function about() {
    document.getElementById("contJuego").classList.add("ocultar");
    document.getElementById("contReglas").classList.add("ocultar");
    document.getElementById("abAmong").classList.remove("ocultar");
    document.getElementById("abAmong").classList.add("mostrar");
}

// REPRODUCE EL EFECTO DE SONIDO PASADO POR PARAMETRO
function playSonido(src) {
    if (efecS) {
        efecSonido.src = src;
        efecSonido.play();
    }
}

// MUTEA LA MUSICA DE FONDO, LOS EFECTOS DE SONIDOS O AMBOS
function mutearMusica(elem) {
    if (elem.id == "musF") {
        if (sonido.paused) {
            sonido.play();
            elem.innerText = "Musica de Fondo: On";
        }
        else {
            sonido.pause();
            elem.innerText = "Musica de Fondo: Off";
            document.getElementById("musF2").value = 0;
        }
    }
    else {
        if (efecS) {
            efecS = false;
            elem.innerText = "Efectos de Sonido: Off";
            document.getElementById("efecS2").value = 0;
        }
        else {
            efecS = true;
            elem.innerText = "Efectos de Sonido: On";
        }
    }

    if ((document.getElementById("musF").innerText.includes("Off") && document.getElementById("efecS").innerText.includes("Off")) || (document.getElementById("musF2").value == 0 && document.getElementById("efecS2").value == 0)) {
        document.getElementById("desplVolumen").src = "IMG/mute.png";
    }
    else {
        document.getElementById("desplVolumen").src = "IMG/volumen.png";
    }

}

// FUNCION QUE BAJA LA MUSICA EN FUNCION DEL INPUT RANGE
function bajarMusica() {

    if (this.id == "efecS2") {
        efecSonido.volume = this.value / 100;

    }
    else {
        sonido.volume = this.value / 100;
    }

    if ((document.getElementById("musF").innerText.includes("Off") && document.getElementById("efecS").innerText.includes("Off")) || (document.getElementById("musF2").value == 0 && document.getElementById("efecS2").value == 0)) {
        document.getElementById("desplVolumen").src = "IMG/mute.png";

    }
    else {
        document.getElementById("desplVolumen").src = "IMG/volumen.png";
    }

}

