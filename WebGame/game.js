/// <reference path="canvas-vsdoc.js" />
include("canvas-utils.js");

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



var cpaddle = {
    width: 32,
    height: 10,
    xvelocity: 0,
    xpos: 0,
    ypos: 0,
    paddlespeed: 5,
    updatePos: function () {
        that = this;
        // update the position of the paddle.  If the paddle
        // is outside the bounds of the canvas move it back
        // into the bounds of the canvas
        if (that.xpos + that.xvelocity > canvasWidth - that.width) {
            xpos = canvasWidth - that.width;
        }
        else if (that.xpos + that.xvelocity < 0) {
            that.xpos = 0;
        }
        else {
            that.xpos = that.xpos + that.xvelocity;
        }

    },
    draw: function (surface) {
        that = this;
        that.updatePos();

        surface.fillStyle = "rgba(238, 130, 238, 0.5)";
        surface.fillRect(that.xpos, that.ypos, that.width, that.height);
    }
}

var cball = {
    x: 0,
    y: 0,
    xspeed: 2.5,
    yspeed: 2.5,
    draw: function (surface) {
        that = this;
        surface.fillStyle = "rgba(0, 0, 0, 0.5)";

        surface.beginPath();
        surface.arc(that.x, that.y, 5, 0, Math.PI * 2, true);
        surface.closePath();
        surface.fill();
        
    }
}

var cscore = {
    aiscore: 0,
    playerscore: 0,
    draw: function (surface) {
        that = this;

        surface.fillStyle = "blue";
        surface.font = "12pt Helvetica";
        //surface.fillText("Score", canvasWidth - 70, canvasHeight / 2);
        surface.fillText("AI: " + that.aiscore, canvasWidth - 70, (canvasHeight / 2) + 14);
        surface.fillText("Player: " + that.playerscore, canvasWidth - 70, (canvasHeight / 2)+28);
    }
}

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
    player.xpos = canvasWidth / 2;
    player.ypos = canvasHeight - 20;

    // AI Player
    var ai = Object.create(cpaddle);
    ai.xpos = canvasWidth / 2;
    ai.ypos = 20;
    
    // Ball
    var ball = Object.create(cball);
    ball.x = player.xpos;
    ball.y = player.ypos - 5;

    // Score
    var score = Object.create(cscore);
    
    // Initial Screen Setup
    drawscreen(ctx);

    // Start the game
    // Call the game loop function 60 times persecond (60 FPS)
    this._intervalId = setInterval(gameloop, 1000 / 60);

    // To stop the game, use the following:
    //clearInterval(this._intervalId);



    function gameloop() {
        that = this;
        rand = 0;

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

        if (ball.yspeed>0){
            if (ai.xpos > (ball.x - rand)){
                ai.xvelocity = -ai.paddlespeed;
            }
            if (ai.xpos < (ball.x + rand)){
                ai.xvelocity = ai.paddlespeed;
            }
        }
        else{
            rand=100*Math.random()%30;
            ai.xvelocity = 0;
        }   
        if (ai.xpos < 0){
            ai.xpos=3;
        } 
        if (ai.xpos >= canvasWidth) {
            ai.xpos = canvasWidth-30;  
        }

        ball.x = ball.x + ball.xspeed;
        ball.y = ball.y + -ball.yspeed;

        if (ball.x < 0 || ball.x > canvasWidth){
            ball.xspeed = -ball.xspeed;
        }

        if (ball.y < 0) {
            // Player Scored
            ball.yspeed = -ball.yspeed;
            score.playerscore += 1;
        }
        else if (ball.y > canvasHeight) {
            // AI Scored
            ball.yspeed = -ball.yspeed;
            score.aiscore += 1;
        }

        // check to see if hit player paddle
        // and whether the ball is behind paddle or coming in front
        // left of paddle is beginning of position x
        // top of paddle is beginning of position y
        if (ball.yspeed < 0){
            if (ball.y >= player.ypos && ball.y <= player.ypos + player.height){
                if ( (ball.x >= (player.xpos-2)) && (ball.x <= (player.xpos + player.width)) ){
                    ball.yspeed = -ball.yspeed;
                }
            }
        }
        //check to see if ai paddle hit
        if (ball.yspeed > 0){
            if (ball.y >= ai.ypos && ball.y <= ai.ypos+ai.height)
            {
                if (ball.x >= ai.xpos-2 && ball.x <= ai.xpos + ai.width)
                {
                    ball.yspeed = -ball.yspeed;
                }
            }
        }


        drawscreen(ctx);
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
        score.draw(surface);

    }

}


function include(filename) {
    var head = document.getElementsByTagName('head')[0];

    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

