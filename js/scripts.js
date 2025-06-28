//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var contenedor;
var fondo;
var dino;
var textoScore;
var suelo;
var gameOver;

var tiempoHastaMoneda = 3;
var tiempoMonedaMin = 2;
var tiempoMonedaMax = 5;
var monedas = [];

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    fondo = document.querySelector(".fondo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
    if(parado) return;
    
    MoverDinosaurio();
    MoverSuelo();
    MoverFondo();
    DecidirCrearObstaculos();
    MoverObstaculos();
    DetectarColision();
    DecidirCrearMoneda();
    MoverMonedas();
    DetectarMoneda();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

// function MoverFondo() {
//     fondo.style.left = -(sueloX * 0.5 % contenedor.clientWidth) + "px";
// }

function MoverFondo() {
    const fondoWidth = fondo.clientWidth;
    let x = -(sueloX * 0.5) % fondoWidth;
    fondo.style.left = x + "px";
    document.querySelector('.fondo2').style.left = (x + fondoWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

// function Estrellarse() {
//     dino.classList.remove("dino-corriendo");
//     dino.classList.add("dino-estrellado");
//     parado = true;
// }

function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    dino.classList.add("animacion-pausada"); // <- pausa cualquier animación restante
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

// function MoverFondo() {
//     fondo.style.left = -(sueloX % contenedor.clientWidth) + "px";
// }

function CrearMoneda() {
    var moneda = document.createElement("div");
    contenedor.appendChild(moneda);
    moneda.classList.add("moneda");
    moneda.posX = contenedor.clientWidth;
    moneda.style.left = contenedor.clientWidth + "px";

    // Altura aérea para que el dino tenga que saltar
    moneda.style.bottom = (sueloY + 100 + Math.random() * 60) + "px"; 

    monedas.push(moneda);
    tiempoHastaMoneda = tiempoMonedaMin + Math.random() * (tiempoMonedaMax - tiempoMonedaMin) / gameVel;
}

// function CrearObstaculo() {
//     var obstaculo = document.createElement("div");
//     contenedor.appendChild(obstaculo);
//     obstaculo.classList.add("cactus");
//     if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
//     obstaculo.posX = contenedor.clientWidth;
//     obstaculo.style.left = contenedor.clientWidth+"px";

//     obstaculos.push(obstaculo);
//     tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
// }

// function CrearObstaculo() {
//     var obstaculo = document.createElement("div");
//     contenedor.appendChild(obstaculo);
//     obstaculo.posX = contenedor.clientWidth;
//     obstaculo.style.left = contenedor.clientWidth + "px";

//     // Elegir aleatoriamente entre cactus y Cristina
//     var tipo = Math.random();
//     if(tipo < 0.25) {
//         obstaculo.classList.add("cactus");
//     } else if(tipo < 0.5) {
//         obstaculo.classList.add("cactus", "cactus2");
//     } else if(tipo < 0.75) {
//         obstaculo.classList.add("cristina");
//     } else {
//         obstaculo.classList.add("axel");
//     }

//     obstaculos.push(obstaculo);
//     tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
// }

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    // Lista de clases posibles de enemigos
    var enemigos = ["cristina", "axel", "maximo"];

    // Elegir uno al azar
    var claseRandom = enemigos[Math.floor(Math.random() * enemigos.length)];

    // Agregar la(s) clase(s) al obstáculo
    claseRandom.split(" ").forEach(clase => obstaculo.classList.add(clase));

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}


function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.3;
        contenedor.classList.add("mediodia");
    }else if(score == 10) {
        gameVel = 1.5;
        contenedor.classList.add("tarde");
    } else if(score == 20) {
        gameVel = 1.75;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

// function GameOver() {
//     Estrellarse();
//     gameOver.style.display = "block";
// }

// function GameOver() {
//     Estrellarse();
//     mostrarGameOver(); 
// }

function GameOver() {
    Estrellarse();
    mostrarGameOver(); // muestra tanto el texto como el botón

    // Pausar animación de enemigos
    obstaculos.forEach(function(obstaculo) {
        obstaculo.classList.add("animacion-pausada");
    });
}


function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}


// function mostrarGameOver() {
//     document.querySelector('.game-over').style.display = 'block';
//     document.querySelector('.btn-restart').style.display = 'block';
// }

function mostrarGameOver() {
    document.querySelector('.game-over-container').style.display = 'block';
}

function reiniciarJuego() {
    // Recarga la página para reiniciar el juego completo
    location.reload();
}

function DecidirCrearMoneda() {
    tiempoHastaMoneda -= deltaTime;
    if(tiempoHastaMoneda <= 0) {
        CrearMoneda();
    }
}

function MoverMonedas() {
    for (var i = monedas.length - 1; i >= 0; i--) {
        if(monedas[i].posX < -monedas[i].clientWidth) {
            monedas[i].parentNode.removeChild(monedas[i]);
            monedas.splice(i, 1);
        } else {
            monedas[i].posX -= CalcularDesplazamiento();
            monedas[i].style.left = monedas[i].posX + "px";
        }
    }
}

function DetectarMoneda() {
    for (var i = monedas.length - 1; i >= 0; i--) {
        if (IsCollision(dino, monedas[i], 10, 10, 10, 10)) {
            monedas[i].parentNode.removeChild(monedas[i]);
            monedas.splice(i, 1);
            GanarPuntos(); // Suma puntos igual que los obstáculos esquivados
        }
    }
}

