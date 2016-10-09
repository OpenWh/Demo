var DrawGraphics = {};

DrawGraphics.Coordinate = {
    createCoordinate: function (x, y) {
        var myCanvas = document.getElementById("myCanvas");
        x = x - myCanvas.offsetLeft;
        y = y - myCanvas.offsetTop;
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
    },
    drawConnectLine: function (myCanvas, cxt, nowcoordinate, nextcoordinate) {
        if (nowcoordinate !== undefined && nextcoordinate != undefined) {
            if (nowcoordinate !== nextcoordinate) {
                cxt.beginPath();
                cxt.moveTo(nowcoordinate._x, nowcoordinate._y);
                cxt.lineTo(nextcoordinate._x, nextcoordinate._y);
                cxt.stroke();
            }
        }
    }
}

DrawGraphics.utilityTools = {
    addMouseDownEvent: function (myCanvas, cxt) {
        document.getElementById("ConnectLineCheckBox").onclick = function () {
            myCanvas.onmousedown = null;
            myCanvas.onmouseup = null;
            if (this.checked) {
                MouseDown(myCanvas, cxt);
            }
        }
    },
    addMouseDownToUpEvent: function (myCanvas, cxt, coordinate1, coordinate2) {
        $(".drawTools").click(function () {
            var tag = this.getAttribute("tag");
            if (tag === "drawConnectLine")
                return;
            myCanvas.onmousedown = null;
            myCanvas.onmouseup = null;
            if (this.checked) {
                MouseDownToUp(this.getAttribute("tag"), myCanvas, cxt, coordinate1, coordinate2);
            }
        });
    },
    showPosition: function () {
        var body = $('body');
        body.append('<label id="ShowXY"></label>')
        var showXY = document.getElementById("ShowXY");;
        myCanvas.onmousemove = function (e) {
            showXY.innerHTML = (e.pageX - myCanvas.offsetLeft) + "," + (e.pageY - myCanvas.offsetTop);
            showXY.style.position = "absolute";
            showXY.style.zIndex = -999;
            showXY.style.left = e.pageX + 'px';
            showXY.style.top = (e.pageY - 15) + 'px'
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
    DrawGraphics.utilityTools.showPosition();
    DrawGraphics.utilityTools.addMouseDownEvent(myCanvas, cxt);
    DrawGraphics.utilityTools.addMouseDownToUpEvent(myCanvas, cxt, coordinate1, coordinate2);
}

function MouseDown(myCanvas, cxt) {
    var addCoordinate = DrawGraphics.Coordinate.createCoordinate;
    var nowcoordinate;
    myCanvas.onmousedown = function (e) {
        nextcoordinate = addCoordinate(e.pageX, e.pageY);
        DrawGraphics.DrawTools.drawConnectLine(myCanvas, cxt, nowcoordinate, nextcoordinate);
        nowcoordinate = nextcoordinate;
    }
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
    },
    myCanvas.onmousemove = function (e) {
        alert("a");
    }
}