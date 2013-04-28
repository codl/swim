var onloadhandlers = [];
function registeronload(f){
    if(!f) throw "you suck";
    if(!window.onload){
        window.onload = function(){
            for(var i = onloadhandlers.length - 1; i >= 0; i--)
                onloadhandlers[i]();
        };
    }
    onloadhandlers.push(f);
}

function linear(i, a1, b1, a2, b2){
    return ((i - a1) * (b2 - a2) / (b1 - a1)) + a2;
}

function step(){
    // here goes everything that must execute each frame
    player.step();
    viewport.step();

    // render shit to the buffer
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    map.render();
    player.render();

    // write buffer to canvas
    realcontext.drawImage(buffer, 0, 0);
}

var canvas, realcontext;
var buffer, context;

function progress(pct, info){
    realcontext.fillStyle = "black";
    realcontext.fillRect(0, 0, canvas.width, canvas.height);
    realcontext.fillStyle = "white";
    realcontext.strokeStyle = "white";
    realcontext.lineWidth = 1;
    realcontext.strokeRect(10.5, 10.5, 99, 19);
    realcontext.fillRect(12, 12, linear(pct, 0, 100, 0, 96), 16);
    if(info){
        realcontext.fillText(info, 10, 40);
    }
}

registeronload(function(){
    var game = document.getElementById("game");
    var nojs = game.firstChild;
    game.removeChild(nojs);
    canvas = document.createElement("canvas");
    buffer = document.createElement("canvas");
    game.appendChild(canvas);
    canvas.width=640;
    canvas.height=480;
    buffer.width=canvas.width;
    buffer.height=canvas.height;
    realcontext = canvas.getContext("2d");
    context = buffer.getContext("2d");
    // load assets, progress bar?
    map.onready = function(){
        window.setInterval(step, 1000/60);
    }
    map.generate();
})

function sign(i){
    return i===0? 1 : i / Math.abs(i);
}

var viewport = {
    x:   -250, // in origin of viewport.
    y:   -140, // in origin of viewport.
    pvx: 0, // player position within viewport.
    pvy: 0,
    // methods.
    step: function() {
        // this should track player movement.
        // update the position of the player INSIDE the
        // viewport, and adjust accordingly.
        viewport.pvx = player.x - viewport.x - canvas.width/2; // find player distance from center of viewpoint
        viewport.pvy = player.y - viewport.y - canvas.height/2;

        if(Math.abs(viewport.pvx) > canvas.width/4){
            var d = viewport.pvx - sign(viewport.pvx) * canvas.width/4; // distance from edge of scroll zone
            window.dx = d;
            viewport.x += 0.1 * d;
        }
        if(Math.abs(viewport.pvy) > canvas.height/4){
            var d = viewport.pvy - sign(viewport.pvy) * canvas.height/4; // distance from edge of scroll zone
            window.dy = d;
            viewport.y += 0.1 * d;
        }
        viewport.x = Math.floor(viewport.x);
        viewport.y = Math.floor(viewport.y);
    }
}
