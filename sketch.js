/*

The Game Project 6 

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var collectables;
var clouds;
var mountains;
var canyons;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var game_score;
var flagpole;
var lives;

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 3;
    startGame();
}

function draw() {
    background(100, 155, 255); // fill the sky blue

    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4); // draw some green ground

    push();
    translate(scrollPos, 0);
    // Draw clouds.
    drawClouds();
    // Draw mountains.
    drawMountains();
    // Draw trees.
    drawTrees();
    // Draw canyons.
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    // Draw collectable items.
    for (var i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound) {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    renderFlagpole();
    pop();
    // Draw game character.
    drawGameChar();
    // Check game status
    if (lives < 1) {
        textSize(20);
        text('Game over. Press space to continue.', gameChar_x - 300, height / 2);
        return;
    }
    if (flagpole.isReached) {
        textSize(20);
        text('Level complete. Press space to continue', gameChar_x - 300, height / 2);
        return;
    }
    // Logic to make the game character move or the background scroll.
    if (isLeft) {
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 3;
        } else {
            scrollPos += 3;
        }
    }
    if (isRight) {
        if (gameChar_x < width * 0.8) {
            gameChar_x += 3;
        } else {
            scrollPos -= 3; // negative for moving against the background
        }
    }
    // Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y) {
        gameChar_y += 2;
        isFalling = true;
    } else {
        isFalling = false;
    }
    // Plummeting
    if (isPlummeting) {
        gameChar_y += 2;
    }
    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    fill(255);
    noStroke();
    text("Score: " + game_score, 20, 20);

    if (!flagpole.isReached) {
        checkFlagpole();
    }

    checkPlayerDie();
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed() {

    // if statements to control the animation of the character when
    // keys are pressed.
    if (keyCode == 37) { //left arrow
        isLeft = true;
    } else if (keyCode == 39) { //right arrow
        isRight = true;
    } else if ((gameChar_y == floorPos_y) && (keyCode == 32)) {
        gameChar_y -= 100;
    }

}

function keyReleased() {

    // if statements to control the animation of the character when
    // keys are released.
    if (keyCode == 37) {
        isLeft = false;
    } else if (keyCode == 39) {
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
    // draw game character
    if (isLeft && isFalling) {
        // add your jumping-left code
        fill(236, 188, 180); //head
        ellipse(gameChar_x, gameChar_y - 55, 15, 30);
        fill(128, 128, 128); //body
        rect(gameChar_x - 5, gameChar_y - 42, 10, 25);
        fill(0); //feet 
        rect(gameChar_x - 9, gameChar_y - 18, 12, 8);
        translate(gameChar_x + 1, gameChar_y - 42);
        fill(236, 188, 180); //arm 
        rotate(0.7 * PI);
        rect(0, 0, 8, 24);
        rotate(-0.7 * PI);
        translate(-gameChar_x - 1, -gameChar_y + 42);
    } else if (isRight && isFalling) {
        // add your jumping-right code
        fill(236, 188, 180); //head
        ellipse(gameChar_x, gameChar_y - 55, 15, 30);
        fill(128, 128, 128); //body
        rect(gameChar_x - 5, gameChar_y - 42, 10, 25);
        fill(0); //feet 
        rect(gameChar_x - 3, gameChar_y - 18, 12, 8);
        translate(gameChar_x + 4, gameChar_y - 35);
        fill(236, 188, 180); //arm 
        rotate(-0.7 * PI);
        rect(0, 0, 8, 24);
        rotate(0.7 * PI);
        translate(-gameChar_x - 4, -gameChar_y + 35);
    } else if (isLeft) {
        // add your walking left code
        fill(236, 188, 180); //head
        ellipse(gameChar_x, gameChar_y - 55, 15, 30);
        fill(128, 128, 128); //body
        rect(gameChar_x - 5, gameChar_y - 42, 10, 35);
        fill(0); //feet 
        rect(gameChar_x - 9, gameChar_y - 8, 12, 8);
        translate(gameChar_x - 10, gameChar_y - 42);
        fill(236, 188, 180); //arm 
        rotate(PI / 14);
        rect(0, 0, 8, 24);
        rotate(-PI / 14);
        translate(-gameChar_x + 10, -gameChar_y + 42);
    } else if (isRight) {
        // add your walking right code
        fill(236, 188, 180); //head
        ellipse(gameChar_x, gameChar_y - 55, 15, 30);
        fill(128, 128, 128); //body
        rect(gameChar_x - 5, gameChar_y - 42, 10, 35);
        fill(0); //feet 
        rect(gameChar_x - 3, gameChar_y - 8, 12, 8);
        translate(gameChar_x + 2, gameChar_y - 40);
        fill(236, 188, 180); //arm 
        rotate(-PI / 14);
        rect(0, 0, 8, 24);
        rotate(PI / 14);
        translate(-gameChar_x - 2, -gameChar_y + 40);
    } else if (isFalling || isPlummeting) {
        // add your jumping facing forwards code
        fill(236, 188, 180); //head
        ellipse(gameChar_x, gameChar_y - 55, 30, 30);
        fill(128, 128, 128); //body
        rect(gameChar_x - 13, gameChar_y - 42, 26, 28);
        fill(0); //feet left
        rect(gameChar_x - 14, gameChar_y - 15, 10, 10);
        fill(0); //feet right
        rect(gameChar_x + 4, gameChar_y - 15, 10, 10);
        //LEFT ARM JUMPING MOVEMENT
        translate(gameChar_x - 18, gameChar_y - 42);
        fill(236, 188, 180); //arm left
        rotate(PI / 14);
        rect(0, 0, 8, 24);
        rotate(-PI / 14);
        translate(-gameChar_x + 18, -gameChar_y + 42)
        //RIGHT ARM JUMPING MOVEMENT
        translate(gameChar_x + 10, gameChar_y - 40);
        fill(236, 188, 180); //arm right
        rotate(-PI / 14);
        rect(0, 0, 8, 24);
        rotate(PI / 14);
        translate(-gameChar_x - 10, -gameChar_y + 40)

    } else {
        // add your standing front facing code
        fill(236, 188, 180); //head
        ellipse(gameChar_x, gameChar_y - 55, 30, 30);
        fill(128, 128, 128); //body
        rect(gameChar_x - 13, gameChar_y - 42, 26, 35);
        fill(0); //feet left
        rect(gameChar_x - 14, gameChar_y - 8, 10, 10);
        fill(0); //feet right
        rect(gameChar_x + 4, gameChar_y - 8, 10, 10);
        fill(236, 188, 180); //arm left
        rect(gameChar_x - 18, gameChar_y - 42, 8, 24);
        fill(236, 188, 180); //arm right
        rect(gameChar_x + 10, gameChar_y - 42, 8, 24);
    }

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        fill(255, 255, 255);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, 120 * clouds[i].scale, 80 * clouds[i].scale);
        ellipse(clouds[i].x_pos - (50 * clouds[i].scale), clouds[i].y_pos, 60 * clouds[i].scale, 60 * clouds[i].scale);
        ellipse(clouds[i].x_pos + (50 * clouds[i].scale), clouds[i].y_pos, 60 * clouds[i].scale, 60 * clouds[i].scale);
        ellipse(clouds[i].x_pos, clouds[i].y_pos - (30 * clouds[i].scale), 89 * clouds[i].scale, 40 * clouds[i].scale);
        ellipse(clouds[i].x_pos, clouds[i].y_pos + (30 * clouds[i].scale), 89 * clouds[i].scale, 40 * clouds[i].scale);
    }
}
// Function to draw mountains objects.
function drawMountains() {
    for (var i = 0; i < mountains.length; i++) {
        fill(128, 128, 128)
        triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos + (260 * mountains[i].scale), mountains[i].y_pos, mountains[i].x_pos + (130 * mountains[i].scale), mountains[i].y_pos - (232 * mountains[i].scale))
        noStroke();
        fill(255, 255, 255)
        noStroke();
        beginShape();
        vertex(mountains[i].x_pos + 107 * mountains[i].scale, mountains[i].y_pos - 192 * mountains[i].scale);
        vertex(mountains[i].x_pos + 130 * mountains[i].scale, mountains[i].y_pos - 232 * mountains[i].scale);
        vertex(mountains[i].x_pos + 158 * mountains[i].scale, mountains[i].y_pos - 182 * mountains[i].scale);
        endShape();
    }
}
// Function to draw trees objects.
function drawTrees() {
    for (var i = 0; i < trees_x.length; i++) {
        fill(120, 100, 40);
        rect(trees_x[i], floorPos_y * 2 / 3, 40, 150);
        noStroke();
        //branches
        fill(0, 155, 0);
        triangle(trees_x[i] - 50, floorPos_y * 2 / 3 + 50, trees_x[i] + 20, floorPos_y * 2 / 3 - 50, trees_x[i] + 90, floorPos_y * 2 / 3 + 50);
        triangle(trees_x[i] - 50, floorPos_y * 2 / 3, trees_x[i] + 20, floorPos_y * 2 / 3 - 100, trees_x[i] + 90, floorPos_y * 2 / 3);
        triangle(trees_x[i] - 50, floorPos_y * 2 / 3 - 50, trees_x[i] + 20, floorPos_y * 2 / 3 - 150, trees_x[i] + 90, floorPos_y * 2 / 3 - 50);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
    fill(100, 155, 255)
    noStroke();
    beginShape();
    vertex(t_canyon.x_pos + 100, 432);
    vertex(t_canyon.x_pos + 200 + t_canyon.width, 432);
    vertex(t_canyon.x_pos + 200 + t_canyon.width, 500);
    vertex(t_canyon.x_pos + 220 + t_canyon.width, 576);
    vertex(t_canyon.x_pos + 210, 576);
    vertex(t_canyon.x_pos + 145, 490);
    endShape();
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
    if ((gameChar_world_x > t_canyon.x_pos + 100) && (gameChar_world_x < t_canyon.x_pos + 200 + t_canyon.width) && gameChar_y >= floorPos_y) {
        isPlummeting = true;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
    fill(208, 219, 27, 127)
    translate(t_collectable.x_pos, t_collectable.y_pos);
    noStroke();
    for (var j = 0; j < 10; j++) {
        ellipse(0, 0, 20 * (t_collectable.size / 50), 50 * (t_collectable.size / 50));
        rotate(PI / 5);
    }
    translate(-t_collectable.x_pos, -t_collectable.y_pos); // undo the translate above
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
    if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 20) {
        t_collectable.isFound = true;
        game_score += 1;
    }
}

function renderFlagpole() {
    push();
    strokeWeight(5);
    stroke(190);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 150);
    fill(255, 255, 0);
    noStroke();
    if (flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 150, 50, 50);
    } else {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    pop();
}

function checkFlagpole() {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d < 15) {
        flagpole.isReached = true;
    }
}

function checkPlayerDie() {
    if (gameChar_y > width - 250) {
        lives -= 1;
        if (lives > 0) {
            startGame();
        }
    }
    for (var i = 1; i <= lives; i++) {
        push();
        fill(255, 0, 0);
        ellipse(20 * i, 50, 10, 10);
        pop();
    }
}

function startGame() {
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.
    trees_x = [150, 300, 500, 1000, 1200, 1500, 1900, -400, -800, -1400];
    //clouds
    clouds = [{
        x_pos: 200,
        y_pos: 150,
        scale: 1
        }, {
        x_pos: 500,
        y_pos: 100,
        scale: 0.6
        }, {
        x_pos: 800,
        y_pos: 150,
        scale: 0.4
        }, {
        x_pos: 1300,
        y_pos: 130,
        scale: 1.2
        }, {
        x_pos: 1600,
        y_pos: 140,
        scale: 0.7
        }, {
        x_pos: 2000,
        y_pos: 155,
        scale: 1.4
        }, {
        x_pos: -500,
        y_pos: 180,
        scale: 1
        }];
    //mountains
    mountains = [{
        x_pos: 150, //position of the bottom left corner
        y_pos: 432, // do not change from 432
        scale: 0.8
            }, {
        x_pos: 350, //position of the bottom left corner
        y_pos: 432, // do not change from 432
        scale: 1.25
            }, {
        x_pos: 850, //position of the bottom left corner
        y_pos: 432, // do not change from 432
        scale: 0.9
            }, {
        x_pos: 1500, //position of the bottom left corner
        y_pos: 432, // do not change from 432
        scale: 1
            }, {
        x_pos: -300, //position of the bottom left corner
        y_pos: 432, // do not change from 432
        scale: 0.7
        }];
    //canyon
    canyons = [{
        x_pos: 600,
        width: 10 //0 is the reference width by default
        }, {
        x_pos: -80,
        width: 0 //0 is the reference width by default
        }, {
        x_pos: 1200,
        width: 0 //0 is the reference width by default
        }, {
        x_pos: -700,
        width: 0 //0 is the reference width by default
        }, {
        x_pos: -1300,
        width: 250 //0 is the reference width by default
        }, {
        x_pos: 2100,
        width: 250 //0 is the reference width by default
        }];
    //collectables
    collectables = [{
        x_pos: 400,
        y_pos: 430,
        size: 50,
        isFound: false //reference/desired value = 50 for no scaling effects
        }, {
        x_pos: 930,
        y_pos: 430,
        size: 50,
        isFound: false
        }, {
        x_pos: -700,
        y_pos: 430,
        size: 50,
        isFound: false
        }, {
        x_pos: 1200,
        y_pos: 430,
        size: 50,
        isFound: false
        }, {
        x_pos: 1700,
        y_pos: 430,
        size: 50,
        isFound: false
        }, {
        x_pos: -300,
        y_pos: 430,
        size: 50,
        isFound: false
        }];

    game_score = 0;

    flagpole = {
        isReached: false,
        x_pos: 2100
    };

}
