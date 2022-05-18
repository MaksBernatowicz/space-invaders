const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.results');
let width = 15;
let currentShooterIndex = 232;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 255; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const border = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,
    240,241,242,243,244,245,246,247,248,249,250,251,252,253,254
];

const alienInvaders = [
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39,
    45,46,47,48,49,50,51,52,53,54
];

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');
        }
    }

    for (let i = 0; i < border.length; i++) {
        squares[border[i]].classList.add('border');
    }
}

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
    }
}

squares[currentShooterIndex].classList.add('shooter');

function moveShooter (e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function leftBtnMove() {
    squares[currentShooterIndex].classList.remove('shooter');
    if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
    squares[currentShooterIndex].classList.add('shooter');
}

function rightBtnMove() {
    squares[currentShooterIndex].classList.remove('shooter');
    if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
    squares[currentShooterIndex].classList.add('shooter');
}

function shootBtn() {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    const boomSound = new Audio('sounds/boom.wav');
    const shootSound = new Audio('sounds/shoot.wav');

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');
            boomSound.play();

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 150);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = results;
        } else if (squares[currentLaserIndex].classList.contains('border')) {
            squares[currentLaserIndex].classList.remove('laser');
            clearInterval(laserId);
        }
    }
    shootSound.play();
    laserId = setInterval(moveLaser, 50);
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultDisplay.innerHTML = 'GAME OVER';
        clearInterval(invadersId);
    }

    if (alienInvaders.some((alienInvader) => squares[alienInvader].classList.contains('border'))) {
        resultDisplay.innerHTML = 'GAME OVER';
        clearInterval(invadersId);
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = 'YOU WIN';
        clearInterval(invadersId);
    }
}

invadersId = setInterval(moveInvaders, 200);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    const boomSound = new Audio('sounds/boom.wav');
    const shootSound = new Audio('sounds/shoot.wav');

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');
            boomSound.play();

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 150);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = results;
        } else if (squares[currentLaserIndex].classList.contains('border')) {
            squares[currentLaserIndex].classList.remove('laser');
            clearInterval(laserId);
        }
    }

    switch (e.key) {        //  empty string ' '
        case ' ':           //  for spacebar key
            shootSound.play();
            laserId = setInterval(moveLaser, 50);
            break;
    }
}

document.addEventListener('keydown', shoot);



