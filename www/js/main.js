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
	height: 50,
	contador:0
}

//crear objeto juego
var juego={
	estado:'parado'
}

// objeto textoRespuesta
var textoRespuesta = {
	contador: -1,
	titulo:'Space Invaders', 
	subtitulo:' Pulsa la tecla S para comenzar'
}
//crear el objeto teclado
var teclado ={}

//array para los disparos
var disparos=[];

//array para disparos enemigos
var disparosEnemigos=[];

//crear el array enemigos
var enemigos=[];  

//Definir variables para las imagenes
var fondo , imgNave , imgEnemigo, imgDisparo, imgdisparoEnemigo;

// array de las imagenes que vamos a usar para precargarlas
var imagenes = ['img/fondo.jpg','img/nave.png','img/disparoenemigo.png','img/disparonave.png','img/enemigo.png'];

//variables de los sonidos
var soniDisparo , soniDisparoEnemigo , soniMuerteNave, soniMuerteEnemigo, soniFinal , soniWin;

//variable que se usara para preloadjs
var preloader;

//Definicion de funciones
function loadMedia(){
	preloader = new PreloadJS();
	preloader.onProgress= progresoCarga;
	cargar();
}

function cargar(){
	while(imagenes.length>0){
		var imagen= imagenes.shift();
		preloader.loadFile(imagen);
	}
}

function progresoCarga(){
	console.log(parseInt(preloader.progress * 100) + "%");
	if(preloader.progress ==1){
		var intervalo= window.setInterval(frameLoop,1000/55);
		fondo = new Image();
		fondo.src='img/fondo.jpg';
		imgNave = new Image();
		imgNave.src='img/nave.png';
		imgEnemigo = new Image();
		imgEnemigo.src='img/enemigo.png';
		imgDisparo = new Image();
		imgDisparo.src='img/disparonave.png';
		imgdisparoEnemigo = new Image();
		imgdisparoEnemigo.src='img/disparoenemigo.png';

		soniDisparo=document.createElement('audio');
		soniDisparo.setAttribute('src','audio/audispenemigo.mp3');

		soniDisparoEnemigo=document.createElement('audio');
		soniDisparoEnemigo.setAttribute('src','audio/audispnave.mp3');

		soniMuerteNave=document.createElement('audio');
		soniMuerteNave.setAttribute('src','audio/explnave.mp3');

		soniMuerteEnemigo=document.createElement('audio');
		soniMuerteEnemigo.setAttribute('src','audio/explenemigo.mp3');

		soniFinal=document.createElement('audio');
		soniFinal.setAttribute('src','audio/videogamefin.mp3');

		soniWin=document.createElement('audio');
		soniWin.setAttribute('src','audio/win.mp3');
	}
}

function dibujarEnemigos(){
	for(var i in enemigos){
		var enemigo= enemigos[i];
		ctx.save();
		if (enemigo.estado=='vivo'){
			ctx.fillStyle='red';
		}

		if(enemigo.estado == 'muerto'){
			console.log(enemigo.estado + "dibujarEnemigos");
			ctx.fillStyle='green';
		}
		ctx.drawImage(imgEnemigo, enemigo.x,enemigo.y,enemigo.width,enemigo.height);
		ctx.restore();
	}
}

function dibujarFondo(){
	ctx.drawImage(fondo,0,0);
}

function dibujarNave(){
	ctx.save();
	ctx.drawImage(imgNave,nave.x,nave.y,nave.width,nave.height);
	ctx.restore();

}

function agregarEventosTeclado(){
	agregarEvento(document,'keydown',function(e){
		//ponemos en true la tecla presionada
		teclado[e.keyCode] = true;
		console.log(e.keyCode);
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

	//actualizar juego si nave cambia de estado
	if(nave.estado=='hit'){
		nave.contador++;
		if(nave.contador >=20){
			nave.contador=0;
			nave.estado='muerto';
			juego.estado='perdido';
			textoRespuesta.titulo='Game Over';
			textoRespuesta.subtitulo='Presiona tecla R para continuar';
			textoRespuesta.contador=0;
				soniMuerteNave.pause();
				soniMuerteNave.currentTime=0;
				soniMuerteNave.play();

			setTimeout(function(){

				soniFinal.play();
			}, 3000);	
		}
	}
}

function dibujarDisparosEnemigos(){

	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		ctx.save();
		ctx.fillStyle="yellow";
		ctx.drawImage(imgdisparoEnemigo,disparo.x, disparo.y, disparo.width,disparo.height);
		ctx.restore();
	}
}

function moverDisparosEnemigos(){
	for (var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		disparo.y +=3;
	}
	disparosEnemigos=disparosEnemigos.filter(function(disparo){
		return disparo.y<canvas.height;
	});
}

function actualizaEnemigos(){

	function agregarDisparosEnemigos(enemigo){
		return{
			x: enemigo.x+20,
			y: enemigo.y+20,
			width: 10,
			height: 33,
			contador:0
		}
	}

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
				enemigo.x += Math.sin(enemigo.contador * Math.PI/90)*5;
/**/
				if(aleatorio(0,enemigos.length *10)==4){
					soniDisparoEnemigo.pause();
					soniDisparoEnemigo.currentTime=0;
					soniDisparoEnemigo.play();
					disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
				}
	
				}
			if(enemigo && enemigo.estado =="hit"){
				enemigo.contador++;
				if(enemigo.contador >=20){
					enemigo.estado="muerto";
					enemigo.contador=0;
					soniMuerteEnemigo.pause();
					soniDisparoEnemigo.currentTime=0;
					soniMuerteEnemigo.play();
					
				}
			}
			}
			
			enemigos= enemigos.filter(function(enemigo){
				if(enemigo && enemigo.estado !="muerto"){return true}
					return false;
			});
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

function dibujaTexto(){
	if(textoRespuesta.contador == -1)return;
	var alpha = textoRespuesta.contador/50.0;
	if (alpha> 1){
		for(var i in enemigos){
			delete enemigos[i];
		}
	}
	ctx.save();
	ctx.globalAlpha=alpha;
	if(juego.estado== 'perdido'){
		ctx.fillStyle='white';
		ctx.font="Bold 40pt Arial";
		ctx.fillText(textoRespuesta.titulo,140,200);
		ctx.font='14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
	if(juego.estado== 'victoria'){
		ctx.fillStyle='white';
		ctx.font="Bold 40pt Arial";
		ctx.fillText(textoRespuesta.titulo,140,200);
		ctx.font='14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
	if(juego.estado== 'parado'){
		ctx.fillStyle='white';
		ctx.font="Bold 40pt Arial";
		ctx.fillText(textoRespuesta.titulo,140,200);
		ctx.font='14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
	ctx.restore();
}

function actualizarEstadoJuego(){
	if(juego.estado =='jugando' && enemigos.length == 0){
		juego.estado= 'victoria';
		textoRespuesta.titulo ='Derrotaste a los enemigos';
		textoRespuesta.subtitulo="Presiona la tecla R para reiniciar";
		textoRespuesta.contador=0;
		setTimeout(function(){

				soniWin.play();
			}, 3000);

	}
	if(textoRespuesta.contador >=0){
		textoRespuesta.contador ++;
	}
	if((juego.estado=='perdido' || juego.estado =='victoria') && teclado[82]){
		juego.estado='iniciando';
		nave.width=50;
		nave.height=50;
		nave.estado='vivo';
		textoRespuesta.contador=-1;
		
	}
	if(juego.estado=='perdido' || juego.estado =='victoria'){
		nave.width=0;
		nave.height=0;
		nave.estado='muerto';
		
	}
	if((juego.estado=='parado')  && teclado[83]){
		
		juego.estado= 'iniciando';
		nave.estado='vivo';
	}
	/*if(juego.estado=='parado'){
		textoRespuesta.titulo ='Space Invaders app';
		textoRespuesta.subtitulo="Presiona la tecla S para comenzar";
	}*/

}

function fire(){
	soniDisparo.pause();
	soniDisparo.currentTime=0;
	soniDisparo.play();
	disparos.push({
		x: nave.x +20,
		y: nave.y -10,
		width: 10,
		height: 30
	})
}

function dibujarDisparos(){
	ctx.save();
	ctx.fillStyle = 'orange';
	for(var i in disparos){
		var disparo = disparos[i];
		ctx.drawImage( imgDisparo ,disparo.x, disparo.y, disparo.width,disparo.height);
	}
	ctx.restore();
}

function hit(a , b){
	var hit=false;

	if(b.x + b.width >= a.x && b.x < a.x + a.width){
		if( b.y + b.height >= a.y && b.y < a.y + a.height){
			hit=true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width){
		if(b.y <= a.y && b.y + b.width >= a.y + a.height){
			hit=true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
		if(a.y <= b.y && a.y + a.width >= b.y + b.height){
			hit=true;
		}
	}
	return hit;
}
function verificarContacto(){
	for(var i in disparos){
		var disparo = disparos[i];
		for( var j in enemigos){
			var enemigo = enemigos[j];
			if(hit(disparo,enemigo)){
				enemigo.estado='hit';
				enemigo.contador=0;
			}
		}
	}
	if(nave.estado=='hit' || nave.estado=='muerto')return;
	for (var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		if(hit(disparo,nave)){
			nave.estado='hit';
			console.log('hubo contacto');
		}
	}
}

function aleatorio(inferior,superior){
	var diferencia= superior-inferior;
	 return Math.floor((Math.random()* diferencia)+inferior);	
}

function frameLoop(){
	actualizarEstadoJuego();
	moverNave();
	moverDisparos();
	moverDisparosEnemigos();
	dibujarFondo();
	verificarContacto();
	actualizaEnemigos();
	dibujarEnemigos();
	dibujarDisparosEnemigos();
	dibujarDisparos();
	dibujaTexto();
	dibujarNave();
}
//Ejecucion de funciones


window.addEventListener('load', init);
function init(){
	agregarEventosTeclado();
	loadMedia();
}