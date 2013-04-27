window.onload = function(){
    var game = document.getElementById("game");
    var nojs = game.firstChild;
    game.removeChild(nojs);
    var canvas = document.createElement("canvas");
    game.appendChild(canvas);
    canvas.width=640;
    canvas.height=480;
    // do shit
}
