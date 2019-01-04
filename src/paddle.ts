
var cpaddle = {
    width: 52,
    height: 5,
    xvelocity: 0,
    x: 0,
    y: 0,
    paddlespeed: 5,
    centerpos: function () {
        that = this;
        return that.x + (that.width / 2);
    },
    move: function(){
        that = this;
        that.x = that.x + that.xvelocity;
    },
    draw: function (surface) {
        that = this;
        surface.fillStyle = "rgba(238, 130, 238, 0.5)";
        surface.fillRect(that.x, that.y, that.width, that.height);
    }
}
