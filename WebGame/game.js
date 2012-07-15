/// <reference path="canvas-vsdoc.js" />
include("canvas-utils.js");
include("paddle.js");
include("ball.js");
include("score.js");
include("buzz.js");

// To get intellisense working with canvas see
// http://abstractform.wordpress.com/2010/02/18/canvas-intellisense-auto-completion-in-visual-studio/
// and see
// http://canvasvsdoc.codeplex.com/

// Begin Setup
var canvasWidth = 0.90 * window.innerWidth;
var canvasHeight = 0.90 *  window.innerHeight;

leftKeyDown = false;
rightKeyDown = false;

// Add a create function to Object.
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () { };
        f.prototype = o;
        return new F();
    }
}



document.onkeydown = function (evt) {
    // left = 37
    // up = 38
    // right = 39
    // down = 40
    if (evt.keyCode == 39) {
        rightKeyDown = true;
    }
    else if (evt.keyCode == 37) {
        leftKeyDown = true;
    }

};

document.onkeyup = function (evt) {
    // left = 37
    // up = 38
    // right = 39
    // down = 40
    if (evt.keyCode == 39) {
        rightKeyDown = false;
    }
    else if (evt.keyCode == 37) {
        leftKeyDown = false;
    }

};  

// End Setup


function startgame(canvasName) {
    // Doing it this way will give intellisense while in visual studio
    var canvas = Canvas.vsGet(document.getElementById(canvasName));

    //The normal way to get a canvas
	//var canvas = document.getElementById(canvasName);
	if(!canvas.getContext){
			return;
	}

	canvas.height = canvasHeight;
	canvas.width = canvasWidth;

    var ctx = canvas.getContext('2d');
    
    // Player
    var player = Object.create(cpaddle);
    player.x = canvasWidth / 2;
    player.y = canvasHeight - 20;

    // AI Player
    var ai = Object.create(cpaddle);
    ai.x = canvasWidth / 2;
    ai.y = 20;
    
    // Ball
    var ball = Object.create(cball);
    ball.x = player.x;
    ball.y = player.y - 5;

    // Score
    var score = Object.create(cscore);


    // Game Objects
    var gameObjects = new Array();
    gameObjects[0] = player;
    gameObjects[1] = ai;
    gameObjects[2] = ball;

    // Audio
    if (!buzz.isSupported()) {
        alert("Your browser does not support html audio.  Install latest chrome, internet explorer, or firefox.!");
    }
    if (!buzz.isMP3Supported()) {
        alert("Your browser doesn't support MP3 Format.");
    }

    var backroundmusic = new buzz.sound("assets/music.mp3");
    backroundmusic.play().loop();

    var bounce = new buzz.sound("assets/bounce.mp3");
    

    // Initial Screen Setup
    drawscreen(ctx);

    // Start the game
    // Call the game loop function 60 times persecond (60 FPS)
    this._intervalId = setInterval(gameloop, 1000 / 60);

    // To stop the game, use the following:
    //clearInterval(this._intervalId);

    gameLoopCount = 0;
    rand=0;
    function gameloop() {
        that = this;
        

        if (rightKeyDown)
        {
            player.xvelocity = player.paddlespeed;
        }
        else if(leftKeyDown)
        {
            player.xvelocity = -player.paddlespeed;
        }
        else
        {
            player.xvelocity = 0;
        }
      
        aiPaddleLogic(ball, ai);
        hasBallHitWall(ball);
        isBallTouchingPaddle(player);
        isBallTouchingPaddle(ai);

        for (var i = 0; i < gameObjects.length; i++) {
            gameObjects[i].move();
        }


        drawscreen(ctx);

        gameLoopCount += 1;
        if (gameLoopCount > (60 * 2.5)) {
            gameLoopCount = 0;
            rand = (100 * Math.random()) % Math.abs(ai.xvelocity - 1);
        }

    }

    function aiPaddleLogic(theBall, aiPaddle) {
        // move ai paddle

        if (theBall.yvelocity < 0) {
            // the ball is moving towards the ai paddle


            if (aiPaddle.x > (theBall.centerpos() + rand)) {
                
                aiPaddle.xvelocity = -aiPaddle.paddlespeed - rand;
            }
            else if (aiPaddle.x + aiPaddle.width < (theBall.centerpos() - rand)) {
                aiPaddle.xvelocity = aiPaddle.paddlespeed - rand;
            }
        }
        else {
            // the ball is moving away from the ai paddle
            if (Math.abs(aiPaddle.centerpos() - theBall.centerpos()) > 250) {
                if (aiPaddle.centerpos() >= theBall.centerpos()) {
                    aiPaddle.xvelocity = -aiPaddle.paddlespeed;
                }
                else if (ai.centerpos() <= theBall.centerpos()) {
                    aiPaddle.xvelocity = aiPaddle.paddlespeed;
                }
            }
            else {
                aiPaddle.xvelocity = 0;
            }
        }
    
     }
     
    function hasBallHitWall(theBall) {

        if (ball.x <= 0 || ball.x >= canvasWidth) {
            ball.xvelocity = -ball.xvelocity;
            bounce.play();
        }

        if (theBall.y <= 0) {
            // Player Scored
            theBall.yvelocity = -theBall.yvelocity;
            score.playerscore += 1;

            bounce.play();
        }
        else if (theBall.y >= canvasHeight) {
            // AI Scored
            theBall.yvelocity = -theBall.yvelocity;
            score.aiscore += 1;

            bounce.play();
        }
    }

    function isBallTouchingPaddle(thePaddle) {
        // check to see if ball is touching player paddle.  If hit reverse velocity
        if (ball.yvelocity < 0) {
           if (ball.y >= thePaddle.y && ball.y <= thePaddle.y + thePaddle.height) {
               if ((ball.x >= (thePaddle.x - 2)) && (ball.x <= (thePaddle.x + thePaddle.width))) {
                   ball.yvelocity = -ball.yvelocity;

                   bounce.play();
                }
            }
        }
        else if (ball.yvelocity > 0) {
            if (ball.y >= thePaddle.y && ball.y <= thePaddle.y + thePaddle.height)
            {
                if (ball.x >= thePaddle.x - 2 && ball.x <= thePaddle.x + thePaddle.width)
                {
                    ball.yvelocity = -ball.yvelocity;

                    bounce.play();
                }
            }
        }
    }


    function drawscreen(surface) {

        // redraw surface background
        surface.fillStyle = "rgb(255, 255, 255)";
        surface.fillRect(0, 0, canvasWidth, canvasHeight);

        // Redraw player paddle 
        player.draw(surface);

        // Redraw ai paddle
        ai.draw(surface);

        // Redraw ball
        ball.draw(surface);

        // Redraw Score
        score.draw(surface, canvasWidth, canvasHeight);

    }

}


function include(filename) {
    var head = document.getElementsByTagName('head')[0];

    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

