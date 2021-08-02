
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var blockSize = 10;
var blockSpeed = 1;

var blocks = [{
    direction: 'right',
    x: canvas.width/2,
    y: canvas.height/2
},{
    direction: 'right',
    x: canvas.width/2 - blockSize,
    y: canvas.height/2
},{
    direction: 'right',
    x: canvas.width/2 - blockSize*2,
    y: canvas.height/2
}];

var moves = [{
    direction: 'right',
    x: canvas.width/2,
    y: canvas.height/2
},{
    direction: 'right',
    x: canvas.width/2 - blockSize,
    y: canvas.height/2
},{
    direction: 'right',
    x: canvas.width/2 - blockSize*2,
    y: canvas.height/2
}];

var apples = [{
    x: canvas.width/2 + blockSize*2,
    y: canvas.height/2
}];

var score = 0;
var lastMove = 'right';

var blockColor = "#00DD00";
var appleColor = "#DD0000";

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39 && (moves[0].direction != 'left')) {
        lastMove = 'right';
    } else if (e.keyCode == 37 && (moves[0].direction != 'right')) {
        lastMove = 'left';
    } else if (e.keyCode == 38 && (moves[0].direction != 'down')) {
        lastMove = 'up';
    } else if (e.keyCode == 40 && (moves[0].direction != 'up')) {
        lastMove = 'down';
    } 
}

function drawBlock(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, blockSize, blockSize);
    ctx.fillStyle = blockColor;
    ctx.fill();
    ctx.closePath();

    //phantom
    var fx;
    var fy;

    if (x < 0) {
        fx = x + canvas.width;
    } else if (x + blockSize > canvas.width) {
        fx = x - canvas.width;
    } else {
        fx = x;
    }

    if (y < 0) {
        fy = y + canvas.height;
    } else if (y + blockSize > canvas.height) {
        fy = y - canvas.height;
    } else {
        fy = y;
    }

    if (fx != x || fy != y) {
        ctx.beginPath();
        ctx.rect(fx, fy, blockSize, blockSize);
        ctx.fillStyle = blockColor;
        ctx.fill();
        ctx.closePath();
    }
}

function drawApple(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, blockSize, blockSize);
    ctx.fillStyle = appleColor;
    ctx.fill();
    ctx.closePath();
}

function eatApple(direction) {
    apples.pop();
    var x = getRandomInt(canvas.width - blockSize);
    var y = getRandomInt(canvas.height - blockSize);
    apples.push({
        x: x - x%10,
        y: y - y%10
    });
    
    score += 1;

    blocks.push({
        direction: '',
        x: moves[moves.length-1].x, 
        y: moves[moves.length-1].y
    }); 

    moves.push(null);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function printScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (apple of apples) {
        drawApple(apple.x, apple.y);
    }
    
    for (var i = 0; i < blocks.length; i++) {
    	if (blocks[i].x % blockSize == 0 && blocks[i].y % blockSize == 0) {
            if (moves[i] != null) {
                blocks[i].direction = moves[i].direction;
            }
        }
        
        if (blocks[i].direction == 'right') {
            blocks[i].x += blockSpeed;
        } else if (blocks[i].direction == 'left') {
            blocks[i].x -= blockSpeed;
        } else if (blocks[i].direction == 'down') {
            blocks[i].y += blockSpeed;
        } else if (blocks[i].direction == 'up') {
            blocks[i].y -= blockSpeed;
        }
    
        if (blocks[i].x + blockSize > canvas.width && blocks[i].direction == 'right') {
            blocks[i].x = blockSpeed - blockSize;
        } else if (blocks[i].x < 0 && blocks[i].direction == 'left') {
            blocks[i].x = canvas.width - blockSpeed;
        }
        if (blocks[i].y + blockSize > canvas.height && blocks[i].direction == 'down') {
            blocks[i].y = blockSpeed - blockSize;
        } else if (blocks[i].y < 0 && blocks[i].direction == 'up') {
            blocks[i].y = canvas.height - blockSpeed;
        }

        drawBlock(blocks[i].x, blocks[i].y);
    } 
    
    if (blocks[0].x % blockSize == 0 && blocks[0].y % blockSize == 0) {
        moves.unshift({
            direction: lastMove,
            x: blocks[0].x,
            y: blocks[0].y
        });

        moves.pop();
    }

    for (apple of apples) {
        if (blocks[0].x+blockSize > apple.x &
            blocks[0].y+blockSize > apple.y &
            blocks[0].x < apple.x+blockSize &
            blocks[0].y < apple.y+blockSize) {
            eatApple(blocks[blocks.length-1].direction);
        }
    }
    
    printScore();
}



setInterval(draw, 10);


