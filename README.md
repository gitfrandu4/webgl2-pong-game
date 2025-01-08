# Pong Game - Practica 2

Este proyecto es un juego de Pong implementado usando WebGL, desarrollado como parte del curso "Informática Gráfica", Practica 2. Demuestra la aplicación práctica de conceptos fundamentales de primitivas 2D y renderización gráfica.

## Tabla de Contenidos

- [Pong Game - Practica 2](#pong-game---practica-2)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Descripción General](#descripción-general)
  - [Fundamentos Técnicos](#fundamentos-técnicos)
  - [Características](#características)
  - [Instalación](#instalación)
  - [Uso](#uso)
  - [Controles](#controles)
  - [Implementación Técnica](#implementación-técnica)
  - [Mejoras](#mejoras)
  - [Licencia](#licencia)

## Descripción General

Este proyecto implementa un juego de Pong utilizando WebGL, demostrando la aplicación práctica de primitivas 2D y técnicas de renderización. El juego incluye elementos básicos como una bola y una paleta, implementados mediante primitivas geométricas fundamentales.

## Fundamentos Técnicos

El juego se basa en los siguientes conceptos clave de gráficos por computadora:

- **Primitivas 2D**:

  - Uso de formas básicas (rectángulos y círculos)
  - Rasterización de primitivas a píxeles
  - Renderización basada en triángulos

  ```javascript
  function drawRectangle(x, y, width, height, color) {
  	var vertices = [
  		x,
  		y,
  		x + width,
  		y,
  		x,
  		y + height,
  		x,
  		y + height,
  		x + width,
  		y,
  		x + width,
  		y + height,
  	];
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  	gl.uniform4fv(colorLocation, color);
  	gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  ```

- **Técnicas de Renderizado**:

  - Implementación de shaders personalizados (vertex y fragment)
  - Manejo de buffers de vértices
  - Control de color y posicionamiento

  ```javascript
  // Vertex Shader
  #version 300 es
  precision mediump float;
  in vec2 aCoordinates;
  out vec2 vCoordinates;
  void main(void) {
    gl_Position = vec4(aCoordinates, 0, 1);
    vCoordinates = aCoordinates;
  }

  // Fragment Shader
  #version 300 es
  precision mediump float;
  uniform vec4 uColor;
  in vec2 vCoordinates;
  out vec4 fragColor;
  void main(void) {
    fragColor = uColor;
  }
  ```

## Características

- Sistema de renderizado WebGL2
- Shaders GLSL 300 es
- Manejo de colisiones
- Sistema de puntuación
- Diseño responsivo
- Controles multiplataforma
- Historial de puntuaciones

## Instalación

1. Clona el repositorio
2. No requiere dependencias adicionales
3. Abre `index.html` en un navegador compatible con WebGL2

## Uso

El juego se inicia a través del botón "Empezar" y muestra:

- Canvas de juego (350x350 píxeles)
- Panel de puntuación actual
- Historial de últimas 5 partidas

## Controles

- **Teclado**:

  - Flecha Arriba: Mover paleta arriba
  - Flecha Abajo: Mover paleta abajo
  - Espacio: Iniciar juego

- **Táctil**:
  - Deslizar arriba/abajo para mover la paleta

## Implementación Técnica

1. **Renderizado**:

   - Uso de WebGL2 para renderizado
   - Shaders personalizados para vértices y fragmentos
   - Buffer de vértices para geometría

   ```javascript
   function init() {
   	canvas = document.getElementById('my_Canvas');
   	gl = canvas.getContext('webgl2');

   	var vertShader = createShader(
   		gl,
   		gl.VERTEX_SHADER,
   		document.getElementById('vertex-shader').text.trim()
   	);
   	var fragShader = createShader(
   		gl,
   		gl.FRAGMENT_SHADER,
   		document.getElementById('fragment-shader').text.trim()
   	);

   	var shaderProgram = createProgram(gl, vertShader, fragShader);
   	gl.useProgram(shaderProgram);
   }
   ```

2. **Primitivas Utilizadas**:

   - Rectángulos para la paleta
   - Círculo para la bola
   - Líneas para el campo de juego

   ```javascript
   function drawLines() {
   	var lines = [
   		[-0.9, -1, -0.9, 1],
   		[0, -1, 0, 1],
   		[-0.8, -1, -0.8, 1],
   		[-1, 0, 1, 0],
   	];
   	lines.forEach((line) => {
   		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);
   		gl.uniform4fv(colorLocation, [1, 1, 1, 1]);
   		gl.drawArrays(gl.LINES, 0, 2);
   	});
   }
   ```

3. **Sistema de Colisiones**:

   - Detección de bordes
   - Colisiones paleta-bola
   - Ajuste de velocidad dinámico

   ```javascript
   function handleCollisions() {
   	if (ball.x + ball.width > 1) {
   		ball.speedX = -ball.speedX;
   	}
   	if (ball.x < -0.95) {
   		resetBall();
   		updateScoreHistory();
   		resetPlayer();
   	}
   	if (ball.y + ball.height > 1 || ball.y < -1) {
   		ball.speedY = -ball.speedY;
   	}
   }
   ```

4. **Optimizaciones**:

   - Uso de requestAnimationFrame para el bucle de juego
   - Manejo eficiente de buffers
   - Cálculos optimizados para colisiones

   ```javascript
   function render() {
   	gl.clearColor(0.1, 0.2, 0.3, 1.0);
   	gl.clear(gl.COLOR_BUFFER_BIT);
   	gl.viewport(0, 0, canvas.width, canvas.height);

   	drawShapePong(ball.shape, ball);
   	drawShapePong(player1.shape, player1);
   	drawLines();
   	handleCollisions();

   	ball.x += ball.speedX;
   	ball.y += ball.speedY;
   	player1.y += player1.movement;

   	window.requestAnimationFrame(render);
   }
   ```

## Mejoras

- Sistema de dificultad progresiva
- Seguimiento de puntuación
- Historial de partidas
- Controles multiplataforma
- Diseño responsivo
- Feedback visual y de jugabilidad

## Licencia

MIT License

---

**Autor**: Francisco Javier López-Dufour Morales
