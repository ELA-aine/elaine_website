const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const UNIT_SIZE = 25;
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const DELAY = 75;

let x = new Array((SCREEN_WIDTH * SCREEN_HEIGHT) / UNIT_SIZE);
let y = new Array((SCREEN_WIDTH * SCREEN_HEIGHT) / UNIT_SIZE);
let bodyParts = 6;
let applesEaten = 0;
let appleX;
let appleY;
let dir = 'R';
let running = false;
let timer;
let random = Math.random;

document.addEventListener('keydown', changeDirection);

startGame();

function startGame() {
    newApple();
    running = true;
    timer = setInterval(gameLoop, DELAY);
}

function gameLoop() {
    if (running) {
        move();
        checkApple();
        checkCollision();
        draw();
    } else {
        clearInterval(timer);
        gameOver();
    }
}

function draw() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Draw grid (optional)
    for (let i = 0; i < SCREEN_HEIGHT / UNIT_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * UNIT_SIZE, 0);
        ctx.lineTo(i * UNIT_SIZE, SCREEN_HEIGHT);
        ctx.strokeStyle = 'gray';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * UNIT_SIZE);
        ctx.lineTo(SCREEN_WIDTH, i * UNIT_SIZE);
        ctx.strokeStyle = 'gray';
        ctx.stroke();
    }

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX, appleY, UNIT_SIZE, UNIT_SIZE);

    // Draw snake
    for (let i = 0; i < bodyParts; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lime';
        ctx.fillRect(x[i], y[i], UNIT_SIZE, UNIT_SIZE);
    }
}

function newApple() {
    appleX = Math.floor(random() * SCREEN_WIDTH / UNIT_SIZE) * UNIT_SIZE;
    appleY = Math.floor(random() * SCREEN_HEIGHT / UNIT_SIZE) * UNIT_SIZE;
}

function move() {
    for (let i = bodyParts; i > 0; i--) {
        x[i] = x[i - 1];
        y[i] = y[i - 1];
    }

    if (dir === 'R') {
        x[0] += UNIT_SIZE;
    } else if (dir === 'L') {
        x[0] -= UNIT_SIZE;
    } else if (dir === 'U') {
        y[0] -= UNIT_SIZE;
    } else if (dir === 'D') {
        y[0] += UNIT_SIZE;
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dir === 'U';
    const goingDown = dir === 'D';
    const goingRight = dir === 'R';
    const goingLeft = dir === 'L';

    if (keyPressed === 37 && !goingRight) {
        dir = 'L';
    } else if (keyPressed === 38 && !goingDown) {
        dir = 'U';
    } else if (keyPressed === 39 && !goingLeft) {
        dir = 'R';
    } else if (keyPressed === 40 && !goingUp) {
        dir = 'D';
    }
}

function checkApple() {
    if (x[0] === appleX && y[0] === appleY) {
        bodyParts++;
        applesEaten++;
        newApple();
    }
}

function checkCollision() {
    for (let i = bodyParts; i > 0; i--) {
        if (x[0] === x[i] && y[0] === y[i]) {
            running = false;
        }
    }

    if (x[0] < 0 || x[0] >= SCREEN_WIDTH || y[0] < 0 || y[0] >= SCREEN_HEIGHT) {
        running = false;
    }
}

function gameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', SCREEN_WIDTH / 6.5, SCREEN_HEIGHT / 2);
}
