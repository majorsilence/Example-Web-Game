var cscore = {
    aiscore: 0,
    playerscore: 0,
    draw: function (surface, canvasWidth, canvasHeight) {
        that = this;

        surface.fillStyle = "blue";
        surface.font = "12pt Helvetica";
        //surface.fillText("Score", canvasWidth - 70, canvasHeight / 2);
        surface.fillText("AI: " + that.aiscore, canvasWidth - 70, (canvasHeight / 2) + 14);
        surface.fillText("Player: " + that.playerscore, canvasWidth - 70, (canvasHeight / 2) + 28);
    }
}
