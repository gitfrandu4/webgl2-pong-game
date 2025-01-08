var ball = {
    shape: 'circle',
    x: -0.05,
    y: -0.05,
    width: 0.1,
    height: 0.1,
    color: [0, 0, 1, 1],
    speedX: 0,
    speedY: 0,
};

var player1 = {
    shape: 'rectangle',
    x: -0.9,
    y: -0.2,
    width: 0.1,
    height: 0.4,
    color: [0.9, 0.2, 0.4, 1],
    movement: 0,
    score: 0,
    scoreHistory: [],
};

function init() {
    canvas = document.getElementById('my_Canvas');
    gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('WebGL no está disponible');
    }

    var vertShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById('vertex-shader').text.trim());
    var fragShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById('fragment-shader').text.trim());

    var shaderProgram = createProgram(gl, vertShader, fragShader);
    gl.useProgram(shaderProgram);

    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    var coordLocation = gl.getAttribLocation(shaderProgram, 'aCoordinates');
    gl.vertexAttribPointer(coordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordLocation);

    colorLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    render();
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertShader, fragShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

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

function drawLines() {
    var lines = [
        [-0.9, -1, -0.9, 1],
        [0, -1, 0, 1],
        [-0.8, -1, -0.8, 1],
        [-1, 0, 1, 0]
    ];
    lines.forEach(line => {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);
        gl.uniform4fv(colorLocation, [1, 1, 1, 1]);
        gl.drawArrays(gl.LINES, 0, 2);
    });
}

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
    if (player1.y + player1.height > 1 && player1.movement > 0) {
        player1.movement = 0;
    }
    if (player1.y < -1 && player1.movement < 0) {
        player1.movement = 0;
    }
    if (ball.x < -0.8 && ball.x + ball.width > player1.x && ball.x < player1.x + player1.width && ball.y + ball.height > player1.y && ball.y < player1.y + player1.height) {
        ball.speedX = -ball.speedX;
        updateScore();
        updateSpeed();
    }
}

function drawShapePong(shape, figure) {
    if (shape === 'rectangle') {
        drawRectangle(figure.x, figure.y, figure.width, figure.height, figure.color);
    } else if (shape === 'circle') {
        drawCircle(figure.x, figure.y, figure.width, figure.height, figure.color);
    }
}

function drawRectangle(x, y, width, height, color) {
    var vertices = [
        x, y, x + width, y, x, y + height,
        x, y + height, x + width, y, x + width, y + height
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function drawCircle(x, y, width, height, color) {
    var vertices = [
        x, y, x + width, y, x, y + height,
        x, y + height, x + width, y, x + width, y + height
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.uniform4fv(colorLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function onKeyDown(key) {
    switch (key.keyCode) {
        case 38:
            player1.movement = 0.02;
            break;
        case 40:
            player1.movement = -0.02;
            break;
        case 32:
            start();
            break;
    }
}

function onKeyUp() {
    player1.movement = 0;
}

function onTouchStart(e) {
    touchobj = e.changedTouches[0];
    prevTouchY = parseInt(touchobj.clientY);
}

function onTouchMove(e) {
    touchobj = e.changedTouches[0];
    touchY = parseInt(touchobj.clientY);
    difY = touchY - prevTouchY;
    player1.movement = -difY * 0.0005;
    prevTouchY = touchY;
}

function onTouchEnd() {
    player1.movement = 0;
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

var canvas = document.getElementById('my_Canvas');
canvas.addEventListener('touchmove', onTouchMove, false);
canvas.addEventListener('touchstart', onTouchStart, false);
canvas.addEventListener('touchend', onTouchEnd, false);

document.getElementById('start').addEventListener('click', start);

function start() {
    resetBall();
    resetPlayer();
    updateSpeed();
}

function updateScore() {
    player1.score += 1;
    document.querySelector('.score p').textContent = `Puntuación: ${player1.score}`;
}

function updateSpeed() {
    ball.speedX = 0.02 + player1.score * 0.002;
    ball.speedY = Math.random() * 0.04 - 0.02;
    console.log(ball.speedX);
}

function resetPlayer() {
    player1.y = 0 - player1.height / 2;
    player1.movement = 0;
    player1.score = 0;
}

function resetBall() {
    ball.speedX = 0;
    ball.speedY = 0;
    ball.x = 0 - ball.width / 2;
    ball.y = 0 - ball.height / 2;
}

function updateScoreHistory() {
    var scoreHistoryList = document.getElementById('score-history-list');
    var listItem = document.createElement('li');
    listItem.textContent = `Juego ${player1.scoreHistory.length + 1}: ${player1.score}`;
    scoreHistoryList.insertBefore(listItem, scoreHistoryList.firstChild);
    player1.scoreHistory.push(player1.score);
}

window.onload = init;
