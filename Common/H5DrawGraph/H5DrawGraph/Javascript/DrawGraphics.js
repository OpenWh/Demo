var drawGraphics = function () {
    return new drawGraphics.prototype.init();
}

drawGraphics.prototype = {
    init: function () {
        return this;
    },
    createCoordinate: function (x, y) {
        var coordinate = {
            _x: x,
            _y: y
        }
        return coordinate;
    },
    drawLine: function (myCanvas, cxt, coordinate1, coordinate2) {
        cxt.beginPath();
        cxt.moveTo(coordinate1._x, coordinate1._y);
        cxt.lineTo(coordinate2._x, coordinate2._y);
        cxt.stroke();
    }
}

drawGraphics.prototype.init.prototype = drawGraphics.prototype;

function drawLine(select, cxt, coordinate1, coordinate2) {
    drawGraphics().drawLine(myCanvas, cxt, coordinate1, coordinate2);
}

$(function () {
    var myCanvas = document.getElementById("myCanvas");
    var cxt = myCanvas.getContext("2d")
    var coordinate1 = null;
    var coordinate2 = null;
    var isFirst = true;
    //$("#drawLinebBtn").click(function () {
    //    var coordinate1 = drawGraphics().createCoordinate(20, 20);
    //    var coordinate2 = drawGraphics().createCoordinate(30, 30);
    //    drawLine(myCanvas, coordinate1, coordinate2);
    //});

    $("#myCanvas").mousedown(function (e) {
        coordinate1 = drawGraphics().createCoordinate(e.pageX, e.pageY);
    });

    $("#myCanvas").mouseup(function (e) {
        coordinate2 = drawGraphics().createCoordinate(e.pageX, e.pageY);
        drawLine(myCanvas, cxt, coordinate1, coordinate2);
    });
});


