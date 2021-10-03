export default class Jugar {
    letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    letrasAdiv = [];
    palabra = "";
    palFinal;
    numPistas = 0;
    numVida;
    existe = false;
    efectoSonido = document.getElementById("efectoSonido");

    constructor(palFinal, lineas) {
        this.palFinal = palFinal;

        /*CREA UNA NUEVA PALABRA */
        this.creaPalabra(lineas);
        this.numPistas = parseInt(this.palabra.length / 3);
        document.getElementById("numPistas").innerText = "PISTAS: " + this.numPistas;


        /*DETIENE LA MUSICA DE LA SECCION DE FONDO E INICIA LA CANCION DE LA INTRO DE LOS SIMPSON */
        this.stopMusica();
        document.getElementById("sonido").play();

        // /*QUITA LAS ANIMACIONES*/
        document.getElementById(this.palabra).classList.remove("letMal");
        document.getElementById("barraVida").classList.remove("parp");

        // /*REINICIO DE VARIABLES*/
        document.getElementById("letAdivinadas").innerText = "";
        this.letrasAdiv = [];
        this.numVida = 100;
        document.getElementById("barraVida").style.backgroundPosition = this.numVida + "%";
        document.getElementById("pista").style.opacity = 1;
        document.getElementById("numPistas").style.display = "block";
        document.getElementById("homer").style.paddingLeft = 0;

        const bot = document.getElementsByTagName("button");
        for (let i = 0; i < bot.length; i++) {
            bot[i].disabled = false;
            bot[i].style.opacity = 1;
        }


    }

    /* RECIBE UNA LETRA Y COMPRUBA SI EXISTE EN LA PALABRA */
    comprobarLetra(pulsada) {
        /*EN EL CASO DE QUE LAS LETRAS ESTEN ENTRE LAS INCLUIDAS Y NO SE HAYA PULSADO ANTES, ENTRA EN LA CONDICIÓN*/
        if (this.letras.includes(pulsada) && !this.letrasAdiv.includes(pulsada)) {

            /*ELIMINAMOS LA ANIMACION DE DE PARPADEO QUE OCURRE CUANDO 
               SE LA LETRA PULSADA NO ESTÁ EN LA PALABRA*/
            document.getElementById(this.palabra).classList.remove("letMal");

            if (!this.comparacion(pulsada)) {
                /*VARIABLE QUE RECOGE EL ELEMENTO DONDE SE ESCRIBEN EN EL HTML LAS LETRAS PULSADAS*/
                const adiv = document.getElementById("letAdivinadas");
                if (adiv.innerText.length > 0) {
                    adiv.innerText += ",";
                }

                /*ESCRIBIMOS LA LETRA PULSADA EN EL HTML*/
                adiv.innerText += "  " + pulsada;
                /*LLAMAMOS A LA FUNCION QUITAR VIDA QUE DEVUELVE TRUE EN CASO DE QUE NO QUEDE MÁS VIDA*/
                if (this.quitarVida()) {
                    this.playMusica("CancionNaruto.mp3");
                    document.getElementById("apu").play();
                    /*TRAS FINALIZAR LA PARTIDA LLAMAMOS A MOSTRAR FIN Y LE PASAMOS UN TEXTO Y UNA IMAGEN*/
                    this.mostrarFin("YOU LOSE", "https://i.pinimg.com/originals/a0/b7/18/a0b718b32a4786699a562ffaff9a5f52.gif",
                        "https://gifimage.net/wp-content/uploads/2017/09/bart-simpson-gif-14.gif");
                }
            }


            /*CUANDO YA SE HAN ACERTADO TODAS LAS LETRAS LLAMAMOS A MOSTRAR FIN*/
            if (this.palFinal.innerText == this.palabra) {
                this.playMusica("VictoriaInazuma.mp3");
                document.getElementById("goku").play();
                this.mostrarFin("YOU WIN", "https://i.pinimg.com/originals/a9/24/09/a92409589f083b5911c59084d7c61a11.gif"
                    , "https://www.chiquipedia.com/images/gifs-bart-simpson.gif");
            }

        }
    }

    /* FUNCION QUE BUSCA LA LETRA QUE SE HA PULSADO, SI LA ENCUENTRA, INTERCAMBIA EL "_", POR LA LETRA*/
    comparacion(letra) {
        var cond = false;
        this.letrasAdiv.push(letra);

        for (let i = 0; i < this.palabra.length; i++) {
            if (this.palabra.charAt(i) == letra) {
                this.palFinal.innerText = this.palFinal.innerText.substr(0, i) + letra + this.palFinal.innerText.substr(i + 1, this.palabra.length);
                cond = true;
            }
        }

        /*SE AGREGA LA PALABRA MODIFICADA (O SIN MODIFICAR) AL HTML*/
        document.getElementById("contPalabra").appendChild(this.palFinal);
        return cond;
    }

    /* CREA LA PALABRA A ADIVINAR */
    creaPalabra(lineas) {
        this.palabra = lineas[parseInt(Math.random() * (lineas.length - 1) + 1)];

        if (this.palabra == undefined) {
            this.palabra = "YOUTUBE";
        }
        this.palabra = this.palabra.trim();

        this.palFinal.id = this.palabra;
        this.palFinal.innerText = "";
        for (let i = 0; i < this.palabra.length; i++) {
            this.palFinal.innerText += "_";
        }
        if (!this.existe) {
            document.getElementById("contPalabra").appendChild(this.palFinal);
        }
        return this.palabra;
    }



    /*FUNCION QUE REDUCE LA BARRA DE VIDA, EN CASO DE NO TENER MÁS VIDA, DEVUELVE FALSE*/
    quitarVida() {
        this.playMusica("Ayy_Caramba.mp3");

        this.numVida -= 16.66;
        var fin = false;
        /*AÑADIMOS ANIMACION DE PARPADEO DE LA LETRA*/
        document.getElementById(this.palabra).classList.add("letMal");

        /*MUEVE LA IMAGEN DE HOMER CORRIENDO HACIA LA DERECHA */
        document.getElementById("homer").style.paddingLeft = 80 - this.numVida + "%";

        /*GUARDAMOS ELE ELEMENTO DE LA BARRA DE VIDA*/
        const vida = document.getElementById("barraVida");

        /*RESTAMOS LA CANTIDAD DE VIDA Y AGREGAMOS EL CAMBIO AL ELEMENTO*/
        vida.style.backgroundPosition = this.numVida + "%";

        /*EN EL CASO DE QUE QUEDEN DOS FALLOS AGREGAMOS OTRA ANIMACION DE PARPADEO
        INFINITO A LA BARRA DE VIDA*/
        if (this.numVida < 60) {
            vida.classList.add("parp");
        }

        /*SI LA VIDA ES MENOR QUE 0 FIN SE CONVIERTE EN TRUE Y SE PASA COMO PARAMETRO*/
        if (this.numVida < 0) {
            fin = true;
        }

        return fin;
    }


    /*SE LE PASA LA EL TEXTO DE VICTORIA O DERROTA Y LA IMAGEN*/
    mostrarFin(texto, imagen, imagen2) {
        document.getElementById("sonido").pause();
        document.getElementsByTagName("body")[0].removeEventListener("keyup", this.comprobarLetra);

        /*MOSTRAMOS LA SECCION FINAL Y OCULTAMOS EL RESTO DE BLOQUES*/
        document.getElementById("secF").classList.remove("ocultar");
        document.getElementById("secJ").classList.add("ocultar");
        document.getElementById("secR").classList.add("ocultar");

        var h1 = document.getElementById("titF");
        var h3 = document.getElementById("subF");
        var img = document.getElementById("imgF");
        var img2 = document.getElementById("imgF2");

        h1.innerText = texto;
        h3.innerText = "La Palabra era: " + this.palabra;
        img.src = imagen;
        img2.src = imagen2;

    }


    /* SE DA UNA PISTA AL USUARIO. EL NUMERO DE PISTAS VARÍA EN FUNCION DE LA LONGITUD DE LA PALABRA*/
    pista() {
        this.playMusica("wow.mp3");
        document.getElementById(this.palabra).classList.remove("letMal");
        let aux = 0;

        while (this.palFinal.innerText.charAt(aux) != "_") {
            aux = [parseInt(Math.random() * (this.palabra.length - 0) + 0)];
        }
        if (document.getElementById("A") != null) {
            var boton = document.getElementById(this.palabra.charAt(aux));
            boton.style.opacity = 0;
            boton.disabled = true;
        }
        this.comparacion(this.palabra.charAt(aux));

        if (this.palFinal.innerText == this.palabra) {
            this.mostrarFin("YOU WIN", "https://i.pinimg.com/originals/a9/24/09/a92409589f083b5911c59084d7c61a11.gif"
                , "https://www.chiquipedia.com/images/gifs-bart-simpson.gif");
        }

        this.numPistas--;
        document.getElementById("numPistas").innerText = "PISTAS: " + this.numPistas;

        if (this.numPistas <= 0) {
            return true;
        }
        else {
            return false;
        }

    }

    playMusica(mus) {
        try {
            this.efectoSonido.setAttribute("src", "SONIDOS/" + mus);
            this.efectoSonido.play();
        } catch (error) {
        }
    }

    /* DETIENE LA MUSICA QUE SE ESTÉ REPRODUCIENDO EN ESE MOMENTO EN LA VARIABLE */
    stopMusica() {
        this.efectoSonido.pause();
    }


    getLetrasAdiv(){
        return this.letrasAdiv;
    }
}