/// <reference path="canvas-vsdoc.js" />
include("canvas-utils.js");

// To get intellisense working with canvas see
// http://abstractform.wordpress.com/2010/02/18/canvas-intellisense-auto-completion-in-visual-studio/
// and see
// http://canvasvsdoc.codeplex.com/

// Begin Setup
var canvasWidth=150;
var canvasHeight=150;

// Add a create function to Object.
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () { };
        f.prototype = o;
        return new F();
    }
}


// End Setup



var paddle = {
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


function draw(canvasName) {
    // Doing it this way will give intellisense while in visual studio
    var canvas = Canvas.vsGet(document.getElementById(canvasName));

    //The normal way to get a canvas
	//var canvas = document.getElementById(canvasName);
	if(!canvas.getContext){
			return;
	}

    var loopFinised = false;


    var ctx = canvas.getContext('2d');
    var player = Object.create(paddle);
    player.xpos = canvasWidth / 2;
    player.ypos = canvasHeight - 20;

    var ai = Object.create(paddle);
    ai.xpos = canvasWidth / 2;
    ai.ypos = 20;

   
    drawscreen(ctx);

   do {

       




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

    }

}


function include(filename) {
    var head = document.getElementsByTagName('head')[0];

    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

