var cball = {
    x: 0,
    y: 0,
    xvelocity: 3.5,
    yvelocity: 3.5,
    width: 5,
    centerpos: function () {
        that = this;
        return that.x + (that.width / 2);
    },
    move: function () {
        that = this;
        that.x = that.x + that.xvelocity;
        that.y = that.y + that.yvelocity;
    },
    draw: function (surface) {
        that = this;
        surface.fillStyle = "rgba(0, 0, 0, 0.5)";

        surface.beginPath();
        surface.arc(that.x, that.y, that.width, 0, Math.PI * 2, true);
        surface.closePath();
        surface.fill();

    }
}