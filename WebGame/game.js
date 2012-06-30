/// <reference path="canvas-vsdoc.js" />
include("canvas-utils.js");

// To get intellisense working with canvas see
// http://abstractform.wordpress.com/2010/02/18/canvas-intellisense-auto-completion-in-visual-studio/
// and see
// http://canvasvsdoc.codeplex.com/

// Begin Setup
var canvasWidth = 0.90 * window.innerWidth;
var canvasHeight = 0.90 *  window.innerHeight;

// Add a create function to Object.
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () { };
        f.prototype = o;
        return new F();
    }
}


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
            xpos = canvasWidth - width;
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
    XSpeed: 2.5,
    YSpeed: 2.5,
    draw: function (surface) {
        that = this;
        surface.fillStyle = "rgba(0, 0, 0, 0.5)";

        surface.beginPath();
        surface.arc(that.x, that.y, 5, 0, Math.PI * 2, true);
        surface.closePath();
        surface.fill();

    }
}

function draw(canvasName) {
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
    
    var player = Object.create(cpaddle);
    player.xpos = canvasWidth / 2;
    player.ypos = canvasHeight - 20;

    var ai = Object.create(cpaddle);
    ai.xpos = canvasWidth / 2;
    ai.ypos = 20;
    
    var ball = Object.create(cball);
    ball.x = player.xpos;
    ball.y = player.ypos - 5;

    drawscreen(ctx);

    var loopFinised = false;

   do {

       
        // Event Handling



        loopFinised = true;
    } while (loopFinised == false)
    
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

    }

}


function include(filename) {
    var head = document.getElementsByTagName('head')[0];

    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

