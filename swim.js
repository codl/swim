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
    //context.clearRect(0, 0, canvas.width, canvas.height);
    player.step();
    viewport.update();
    // render();
    realcontext.clearRect(0, 0, canvas.width, canvas.height);
    realcontext.drawImage(buffer, 0, 0);
}

var canvas, realcontext;
var buffer, context;

registeronload(function(){
    var game = document.getElementById("game");
    var nojs = game.firstChild;
    game.removeChild(nojs);
    canvas = document.createElement("canvas");
    buffer = document.createElement("canvas");
    game.appendChild(canvas);
    canvas.width=640;
    canvas.height=480;
    buffer.width=640;
    buffer.height=480;
    realcontext = canvas.getContext("2d");
    context = buffer.getContext("2d");
    // load assets, progress bar?
    window.setInterval(step, 1000/60);
})

function draw_test_tile() {
    //draw test tile.
    var img = new Image();
    img.src = "art/test.png";
    img.onload = function() {
        context.drawImage(img, -viewport.x, -viewport.y);
    };
}

function sign(i){
    return i===0? 1 : i / Math.abs(i);
}

var viewport = {
    x:   0, // in origin of viewport.
    y:   0, // in origin of viewport.
    pvx: 0, // player position within viewport.
    pvy: 0,
    // methods.
    update: function() {
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
        draw_test_tile();
    }
}

