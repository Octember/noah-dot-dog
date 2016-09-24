var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var ACCELERATION  = 1.5;
var MAX_SPEED     = 50;
var MAX_DOGE      = 2;
var DOGE_SIZE     = 150;
var DOGE_PADDING  = 5;
var PADDED_DOGE   = DOGE_SIZE + DOGE_PADDING;
var FOOD_SIZE     = 75;

var doges  = [];
var foods  = [];

var canvasElement = document.getElementById('canvas');
var context   = canvasElement.getContext('2d');
CANVAS_WIDTH  = context.canvas.width  = $("#canvas").width();
CANVAS_HEIGHT = context.canvas.height = $("#canvas").height();

var dogeImage  = new Image(); // HTML5 Constructor
var breadImage = new Image();
dogeImage.src  = 'images/doge.png';
breadImage.src = 'images/bread.png';


var keyStates = {};

document.addEventListener('keydown', function(event) {
    keyStates[event.keyCode] = true;
}, true);
document.addEventListener('keyup', function(event) {
    keyStates[event.keyCode] = false;
}, true);

var FPS = 30;
setInterval(function() {
  update();
  draw();
}, 1000/FPS);

setInterval(function() {
  spawnFood();
}, 3000);

function sumSquares(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function spawnFood() {
    var x = FOOD_SIZE + (Math.random() * (CANVAS_WIDTH - FOOD_SIZE * 2))
    var y = FOOD_SIZE + (Math.random() * (CANVAS_HEIGHT - FOOD_SIZE * 2))

    foods.push([x, y]);
}

var player = {
  color: "#00A",
  x: 220,
  y: 270,
  dx: 2,
  dy: -2,
  width: 32,
  height: 32,

  update: function() {
    var dx = 0,
        dy = 0;
    if (keyStates[37] || keyStates[65]) {
        // Left or A
        dx = -ACCELERATION;
    } else if (keyStates[39] || keyStates[68]) {
        // right or D
        dx = ACCELERATION;
    }

    if (keyStates[38] || keyStates[87]) {
        dy = -ACCELERATION;
    } else if (keyStates[40] || keyStates[83]) {
        dy = ACCELERATION;
    }

    var acceleration = sumSquares(dx, dy)
    dx = (acceleration == 0) ? 0 : dx * ACCELERATION / acceleration;
    dy = (acceleration == 0) ? 0 : dy * ACCELERATION / acceleration;

    var newSpeed = sumSquares(player.dx + dx, player.dy + dy);

    // Only accelerate if we're below max speed
    if (newSpeed < MAX_SPEED) {
        player.dx += dx;
        player.dy += dy;
    }

    if (player.x + player.dx - (DOGE_SIZE / 2) < 0) {
        player.dx *= -0.5;
        player.x   = DOGE_SIZE / 2
    } else if (player.x + player.dx + (DOGE_SIZE / 2) > CANVAS_WIDTH) {
        player.dx *= -0.5;
        player.x  = CANVAS_WIDTH - (DOGE_SIZE / 2)
    } else {
        player.x += player.dx;
    }

    if (player.y + player.dy < (DOGE_SIZE / 2)) {
        player.dy *= -0.5;
        player.y  = DOGE_SIZE / 2;
    } else if (player.y + player.dy > CANVAS_HEIGHT + (DOGE_SIZE / 2)) {
        player.y = (DOGE_SIZE / 2);
    } else {
        player.y += player.dy;
    }

    doges.push([player.x, player.y]);
  },

    intersect: function(food) {
        var r1 = DOGE_SIZE / 2;
        var r2 = DOGE_SIZE / 2;

        var dx = Math.pow(player.x - food[0], 2);
        var dy = Math.pow(player.y - food[1], 2);

        var distance = Math.sqrt(dx + dy);

        return distance + 50 < r1 + r2;
    }
};

function update() {
    player.update();

    if (doges.length > MAX_DOGE) {
        doges.shift();
    }

    // check intersections
    for (var i = 0; i < foods.length; i++) {
        if (player.intersect(foods[i])) {
            foods.splice(i, 1);
            MAX_DOGE += 1;
        }
    }
}

function draw() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.fillStyle = "blue";
    context.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30);


    for (var i = 0; i < doges.length; i++) {
        var coords = doges[i];

        var x = coords[0] - (PADDED_DOGE / 2);
        var y = coords[1] - (PADDED_DOGE / 2);

        context.drawImage(dogeImage, x, y, PADDED_DOGE, PADDED_DOGE);

        // Wrap around
        if (y + DOGE_SIZE > CANVAS_HEIGHT) {
            context.drawImage(dogeImage, x, y - CANVAS_HEIGHT, PADDED_DOGE, PADDED_DOGE);

        }
    }

    for (var i = 0; i < foods.length; i++) {
        var coords = foods[i];
        context.drawImage(breadImage, coords[0] - (FOOD_SIZE / 2), coords[1] - (FOOD_SIZE / 2), FOOD_SIZE, FOOD_SIZE);
    }


}


$( document ).ready(function() {
    setTimeout(function() {
        $('#welcome').fadeOut(1000) // Fade out over 1 sec
    }, 1500);

    setTimeout(function() {
        $('#tips').fadeIn(1000) // Fade out over 1 sec
    }, 2500);

    setTimeout(function() {
        $('#tips').fadeOut(1000) // Fade out over 1 sec
    }, 3500);
});