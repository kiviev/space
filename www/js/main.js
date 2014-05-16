/**
 * 
 */
//objetos importantes de canvas
var canvas= document.getElementById('game');
var ctx= canvas.getContext('2d');

//Crear el objeto de la nave
var nave={
	x:100,
	y: canvas.height -100,
	width: 50,
	height: 50
}

//crear objeto juego
var juego={
	estado:'iniciando'
}

//crear el objeto teclado
var teclado ={}

//array para los disparos
var disparos=[];

//crear el array enemigos
var enemigos=[];

//Definir variables para las imagenes
var fondo;

//Definicion de funciones
function loadMedia(){
	fondo = new Image();
	fondo.src='img/fondo.jpg';
	fondo.onload=function(){
		var intervalo= window.setInterval(frameLoop,1000/55);
	}

}

function dibujarEnemigos(){
	for(var i in enemigos){
		var enemigo= enemigos[i];
		ctx.save();
		if (enemigo.estado=='vivo'){ctx.fillStyle='red';}
		if(enemigo.estado == 'muerto'){ctx.fillStyle='black';}
		ctx.fillRect(enemigo.x,enemigo.y,enemigo.width,enemigo.height);
		ctx.restore();
	}
}

function dibujarFondo(){
	ctx.drawImage(fondo,0,0);
}

function dibujarNave(){
	ctx.save();
	ctx.fillStyle='white';
	ctx.fillRect(nave.x,nave.y,nave.width,nave.height);
	ctx.restore();
}

function agregarEventosTeclado(){
	agregarEvento(document,'keydown',function(e){
		//ponemos en true la tecla presionada
		teclado[e.keyCode] = true;
	})
	agregarEvento(document,'keyup',function(e){
		//ponemos en false la tecla que dejo de ser presionada
		teclado[e.keyCode] = false;
	})
	

	function agregarEvento(elemento,nombreEvento,funcion){
		if(elemento.addEventListener){
			//resto de navegadores
			elemento.addEventListener(nombreEvento,funcion,false);
		}else if(evento.attachEvent){
			//solo par InternetExplorer
			evento.attachEvent(nombreEvento,funcion);
		}
	}
}
function moverNave(){
	//movimiento a la izquierda
	if(teclado[37]){
		nave.x -=6;
		if(nave.x < 0){nave.x=0;}
	}
	//movimiento a la derecha
	if(teclado[39]){
		var limite = canvas.width - nave.width;
		nave.x +=6;
		if(nave.x > limite){nave.x= limite;}
	}
	//movimiento hacia arriba 
	if(teclado[38]){
		nave.y -=6;
		if(nave.y < 0){nave.y=0;}
	}
	//movimiento a la derecha
	if(teclado[40]){
		var limite = canvas.height - nave.height;
		nave.y +=6;
		if(nave.y > limite){nave.y= limite;}
	}
	//disparos
	if(teclado[32]){
		if(!teclado.fire){
			fire();
			teclado.fire=true;
		}
		
	}else{teclado.fire = false}
}
//parseInt(Math.random()*5)
function actualizaEnemigos(){
	if(juego.estado == 'iniciando'){
		for(var i =0 ; i<10 ; i++){
			enemigos.push({
				x: 10 + (i*60),
				y: 10,     
				height: 40,   
				width:40,  
				estado:'vivo',
				contador:0
			});
			juego.estado='jugando';
		}
	}
	for(var i in enemigos){
			var enemigo = enemigos[i];
			if(!enemigo){continue}
			if(enemigo && enemigo.estado == 'vivo'){
				enemigo.contador ++;
				enemigo.x += Math.sin(enemigo.contador * Math.PI/70)*5;
				}
			}
}

function moverDisparos(){
	for(var i  in disparos){
		var disparo = disparos[i];
		disparo.y -= 2;
	}
	disparos = disparos.filter(function(disparo){
		return disparo.y > 0;
	});
}

function fire(){
	disparos.push({
		x: nave.x +20,
		y: nave.y -10,
		width: 10,
		height: 30
	})
}

function dibujarDisparos(){
	ctx.save();
	ctx.fillStyle = 'white';
	for(var i in disparos){
		var disparo = disparos[i];
		ctx.fillRect(disparo.x, disparo.y, disparo.width,disparo.height);
	}
	ctx.restore();
}

function frameLoop(){
	moverNave();
	actualizaEnemigos();
	moverDisparos();
	dibujarFondo();
	dibujarEnemigos();
	dibujarDisparos();
	dibujarNave();
}
//Ejecucion de funciones

agregarEventosTeclado();
loadMedia();


































/*window.addEventListener('load',init);

	function init(){
		
		var canvas= document.getElementById('game');
		var ctx= canvas.getContext('2d');

		
	}
	*/