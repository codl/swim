var onloadhandlers = [];
function registeronload(f){
    if(!f) throw "you suck";
    if(!window.onload){
        window.onload = function(){
            for(var i = 0; i < onloadhandlers.length; i++)
                onloadhandlers[i]();
        };
    }
    onloadhandlers.push(f);
}

function step(){
    // here goes everything that must execute each frame
    player.step();
    // render();
}

var canvas, context;

registeronload(function(){
    var game = document.getElementById("game");
    var nojs = game.firstChild;
    game.removeChild(nojs);
    canvas = document.createElement("canvas");
    game.appendChild(canvas);
    canvas.width=640;
    canvas.height=480;
    context = canvas.getContext("2d");
    // load assets, progress bar?
    window.setInterval(step, 1000/60);
})
