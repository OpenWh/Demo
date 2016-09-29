var DrawGraphics = {};

DrawGraphics.Coordinate = {
    createCoordinate: function (x, y) {
        var coordinate = {
            _x: x,
            _y: y
        }
        return coordinate;
    },
}

DrawGraphics.DrawTools = {
    drawLine: function (myCanvas, cxt, coordinate1, coordinate2) {
        if (coordinate1 !== null && coordinate2 != null) {
            cxt.beginPath();
            cxt.moveTo(coordinate1._x, coordinate1._y);
            cxt.lineTo(coordinate2._x, coordinate2._y);
            cxt.stroke();
        }
    },
    drawRect: function (myCanvas, cxt, coordinate1, coordinate2) {
        if (coordinate1 !== null && coordinate2 != null && coordinate1._x != coordinate2._x && coordinate1._y != coordinate2._y) {
            cxt.beginPath();
            cxt.rect(coordinate1._x, coordinate1._y, coordinate2._x - coordinate1._x, coordinate2._y - coordinate1._y);
            cxt.stroke();
        }
    }
}

window.onload = function () {
    var myCanvas = document.getElementById("myCanvas");
    var cxt = myCanvas.getContext("2d");
    var coordinate1 = null;
    var coordinate2 = null;
    var method = "drawLine";

    document.getElementById("LineCheckBox").setAttribute("checked", "checked");
    MouseDownToUp(method, myCanvas, cxt, coordinate1, coordinate2);

    $(".drawTools").click(function () {
        myCanvas.onmousedown = null;
        myCanvas.onmouseup = null;
        if (this.checked) {
            MouseDownToUp(this.getAttribute("tag"), myCanvas, cxt, coordinate1, coordinate2);
        }
    });
}

function MouseDownToUp(method, myCanvas, cxt, coordinate1, coordinate2) {
    var addCoordinate = DrawGraphics.Coordinate.createCoordinate;
    myCanvas.onmousedown = function (e) {
        coordinate1 = addCoordinate(e.pageX, e.pageY);
    }
    myCanvas.onmouseup = function (e) {
        coordinate2 = addCoordinate(e.pageX, e.pageY);
        switch (method) {
            case "drawLine":
                DrawGraphics.DrawTools.drawLine(myCanvas, cxt, coordinate1, coordinate2);
                break;
            case "drawRect":
                DrawGraphics.DrawTools.drawRect(myCanvas, cxt, coordinate1, coordinate2);
                break;
        }
    }
}