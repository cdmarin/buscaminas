/**
 * LOS MINIJUEGOS SON UNA REFERENCIA A LA TEMATICA DEL BUSCAMINAS,
 * YA QUE EL AMONG US CONTIENE MINIJUEGOS QUE LOS JUGADORES HAN DE SUPERAR
 * PARA GANAR LA PARTIDA AL IMPOSTOR
 * 
 */



// HACE QUE DESAPAREZCA EL ELEMENTO DE LOS MINIJUEGOS
function desaparecerElemento(elem) {
    elem.style.animation = "desaparecer 2s normal forwards";
    document.getElementById("contJuego").classList.remove("ocultar");

    setTimeout(() => {
        elem.classList.add("ocultar");
        elem.classList.remove("mostrar");
        elem.style.animation = "";
    }, 1100);
}



//********************************************************* MINIJUEGO DE ASTEROIDES ***************************************************

// VARIABELES
var maximo = [];
var totalDestruir = 10;
var efec = document.createElement("audio");
var efecExpl = document.createElement("audio");
var sonidoFondo;
var musFondo = document.createElement("audio");
musFondo.src = "SONIDOS/fondo.mp3";
var meteoritos;

// COMIENZA LA PARTIA DE LOS ASTEROIDES
function empiezaAsteroides(sonido, efecSonido) {
    // INICIA EL ARRAY DE BOOLEANOS PARA QUE LOS METEORITOS NO SE REPITAN
    for (let i = 0; i < 9; i++) {
        maximo[i] = false;
    }

    // PAUSA EL SONIDO Y REPRODUCE LA DEL MINIJUEGO
    sonido.pause();
    sonidoFondo = sonido;
    musFondo.volume = sonido.volume;
    musFondo.play();

    // CAMBIAMOS EL VOLUMEN CON RESPECTO A LO ESTABLECIDO EN LA OTRA PANTALLA
    efec.volume = efecSonido.volume;
    efecExpl.volume = efecSonido.volume;
    document.getElementById("rest").innerHTML = "METEORITOS RESTANTES: 10";
    document.documentElement.addEventListener("mousemove", posRaton);
    document.documentElement.addEventListener("click", dispararMeteorito);

    // GENERA LOS METEORITOS CADA MEDIO SEGUNDO
    meteoritos = setInterval(() => {
        if (maximo.indexOf(false) != -1) {
            simularMeteoritos();
        }

    }, 500);
}

// OBTIENE LA POSICION DEL RATON
function posRaton(e) {
    var posY = e.pageY;
    var posX = e.pageX

    document.getElementById("puntero").style.top = (posY - 98) + "px";
    document.getElementById("puntero").style.left = (posX - 90) + "px";
}

//  MUEVE EL METEORITO EN UNA POSICION ALEATORIA
function simularMeteoritos() {
    var movX = parseInt(Math.random() * (80 - -80) + -80) / 20;
    var movY = parseInt(Math.random() * (80 - -80) + -80) / 20;

    // CREACION DEL ELEMENTO, SE LE ASIGNA UNA POSICION Y UNA ROTACION ALEATORIA 
    var met = document.createElement("a");
    met.style.backgroundImage = "url(IMG/meteorito.png)";
    met.id = maximo.indexOf(false);
    maximo[met.id] = true;

    met.className = "meteorito";
    met.style.transform = " rotate(" + (Math.random() * (180 - 0) + 0) + "deg)"
    posIncial(met, movY, movX);

    document.getElementById("contMet").appendChild(met);

    // INTERVALO DE MOVIMIENTO DEL METEORITO
    var x = setInterval(() => {
        met.style.top = (parseFloat(met.style.top) + movY) + "%";
        met.style.left = (parseFloat(met.style.left) + movX) + "%";

        // SI SALE DE LOS LIMITES BORRA EL ELEMENTO Y FINALIZA EL INTERVALO
        if ((parseFloat(met.style.top) > 100) || (parseFloat(met.style.left) > 100) || (parseFloat(met.style.top) <= -30) || (parseFloat(met.style.left) <= -30)) {
            maximo[met.id] = false;
            document.getElementById("contMet").removeChild(met);

            clearInterval(x);
        }
    }, 50);
}

// COLOCA EL METEORITO EN UNA ESQUINA DE LA PANTALLA PARA EMPEZAR SU MOVIMIENTO
function posIncial(met, movY, movX) {
    if (movX >= 0 && movY >= 0) {
        met.style.top = "-20%";
        met.style.left = "-20%";
    }
    else if (movX < 0 && movY >= 0) {
        met.style.top = "-20%";
        met.style.left = "100%";
    }
    else if (movX >= 0 && movY < 0) {
        met.style.top = "100%";
        met.style.left = "-20%";
    }
    else {
        met.style.top = "100%";
        met.style.left = "100%";
    }
}

// DETECTA SI SE HA DISPARADO AL METEORITO
function dispararMeteorito(e) {
    playEfecto("disparo.mp3");

    // DETECTA SOBRE CUAL Y LO ELIMINA
    if (e.srcElement.tagName == "A") {
        totalDestruir--;
        document.getElementById("rest").innerHTML = "METEORITOS RESTANTES: " + totalDestruir;

        var met = document.getElementById(e.srcElement.id);
        met.style.backgroundImage = "url(IMG/metRoto.png)";


        efecExpl.src = "SONIDOS/explosion.mp3";
        efecExpl.play();
        met.style.animation = "desaparecer 1s normal";

        setTimeout(() => {
            met.style.top = "200%";
        }, 500);

        // SI SE HAN DESTRUIDO TODOS, SE REINICIA LA MUSICA, SE ELIMINAN LOS EVENTOS Y SE VUELVE AL JUEGO
        if (totalDestruir == 0) {
            musFondo.pause();
            musFondo.currentTime = 0;
            document.documentElement.removeEventListener("mousemove", posRaton);
            document.documentElement.removeEventListener("click", dispararMeteorito);
            clearInterval(meteoritos);
            sonidoFondo.play();
            desaparecerElemento(document.getElementById("minAsteroides"));
            totalDestruir = 10;

        }

    }
}

// REPRODUCE UN EFECTO DE SONIDO
function playEfecto(src) {
    efec.src = "SONIDOS/" + src;
    efec.play();
}





//********************************************************* MINIJUEGO DE CABLES ***************************************************
// VARIBALES
var posCables = [100, 300, 500, 700];
var cable;
var moverCable = false;
var condColores = new Map([
    ["rojo", false],
    ["azul", false],
    ["amarillo", false],
    ["verde", false]
]);


// COLOCA LOS CABLES ALEATORIAMENTE Y AGREGA LOS EVENTOS A ESTOS
function empiezaCables() {
    var lineas = document.getElementsByTagName("line");
    for (let i = 0; i < 4; i++) {
        lineas[i].addEventListener("click", elemClick);
    }

    document.documentElement.addEventListener("mousemove", moverLinea);

    colocaCables();
}


// TERIMNA LA PARTIDA Y,  REINICIA LAS VARIABLES Y ELIMINA LOS EVENTOS
function terminaPartida() {
    var lineas = document.getElementsByTagName("line");
    for (let i = 0; i < 4; i++) {
        lineas[i].removeEventListener("click", elemClick);
    }
    document.documentElement.removeEventListener("mousemove", moverLinea);

    condColores = new Map([
        ["rojo", false],
        ["azul", false],
        ["amarillo", false],
        ["verde", false]
    ]);

    desaparecerElemento(document.getElementById("minCable"));
}

// COMPRUEBA DONDE SE HA HECHO CLICK
function elemClick(e) {

    // SI SE HACE CLICK SE MUEVE LA RAYA DONDE ESTÁ EL RATON
    if (!moverCable) {
        cable = this.id;
        moverCable = true;
    }
    else {
        // SI SE VUELVE A HACER CLICK SE DEJA DE MOVER LA RAYA Y SE COMPRUEBA SI ESTÁ CORRECTA
        // EN TAL CASO SU POSICION DEL MAP SE VUELVE A TRUE
        moverCable = false;
        condColores.set(cable, false);

        var posx = (e.pageX / document.documentElement.scrollWidth) * 100;
        var posy = parseInt((document.getElementById(this.id + "2").getAttribute("y1")));
        var stroke = (parseInt(document.getElementById(this.id + "2").getAttribute("stroke-width")) / 100) * document.documentElement.scrollHeight;

        if ((posx >= 85 && posx < 100) && (e.pageY >= (posy - stroke) && e.pageY < (posy + stroke))) {
            condColores.set(cable, true);
        }

        // COMPRUEBA SI EL RESULTADO ESTÁ BIEN
        var cond = true;
        condColores.forEach(x => {
            if (!x) {
                cond = false;
            }
        });

        // SI SE HAN CONECTADO LOS CABLES TERMINA EL MINIJUEGO
        if (cond) {
            terminaPartida();
        }
    }

}

//MUEVE LA RAYA DONDE ESTÁ EL RATON
function moverLinea(e) {
    if (moverCable) {
        document.getElementById(cable).setAttribute("y2", (e.pageY) + "px");
        document.getElementById(cable).setAttribute("x2", (e.pageX) + "px");
    }
}

//COLOCA LOS CABLES DE FORMA ALEATORIA
function colocaCables() {
    var lineas = document.getElementsByTagName("line");
    var usadas = [];

    for (let i = 0; i < lineas.length; i++) {
        var pos = parseInt(Math.random() * (posCables.length - 0) + 0);

        if (!usadas.includes(posCables[pos])) {
            lineas[i].setAttribute("y1", posCables[pos]);
            lineas[i].setAttribute("y2", posCables[pos]);
            usadas.push(posCables[pos]);
        }
        else {
            i--;
        }

        if (i < 4) {
            lineas[i].setAttribute("x2", "100");
        }

        if (i == 3) {
            usadas = [];
        }


    }
}



export { empiezaCables, empiezaAsteroides };
