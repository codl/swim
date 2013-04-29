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
    render_sprites();
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
    sprite_canvas = document.createElement("canvas");
    game.appendChild(canvas);
    canvas.width=640;
    canvas.height=480;
    buffer.width=canvas.width;
    buffer.height=canvas.height;
    sprite_canvas.width=15;
    sprite_canvas.height=10;
    realcontext = canvas.getContext("2d");
    context = buffer.getContext("2d");
    sprite_context = sprite_canvas.getContext("2d");
        //temp
    sprite_context.scale(-1, 1);
    // load assets, progress bar?
    // load player here during test.
    map.onready = function(){
        scenery.onready = function(){
            player.init();
            window.setInterval(step, 1000/60);
        }
        scenery.place(40);
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
            viewport.x += 0.05 * d;
        }
        if(Math.abs(viewport.pvy) > canvas.height/4){
            var d = viewport.pvy - sign(viewport.pvy) * canvas.height/4; // distance from edge of scroll zone
            window.dy = d;
            viewport.y += 0.05 * d;
        }
        viewport.x = (viewport.x < 0)?0:(viewport.x > map.width - canvas.width)?map.width-canvas.width:Math.floor(viewport.x);
        viewport.y = (viewport.y < 0)?0:(viewport.y > map.height - canvas.height)?map.height-canvas.height:Math.floor(viewport.y);
    }
}

var frame_counter = 0;

function render_sprites() {
    player.render(); // render player.

    // fetch list of active sprites, render them accordingly.
    frame_counter++;
}

//context.drawImage(pIdle, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1, player.y - viewport.y -1, 15, 10);
function animate_sprite(image, sx, sy, swidth, sheight, x, y, width, height, flip) {
    if (flip === true) {
        if (sprite_canvas.width !== width && sprite_canvas.height !== height) {
            sprite_canvas.width = width;
            sprite_canvas.height = height;
            console.log("changed size of Sprite_canvas.");
        }
        sprite_context.clearRect(-(width), 0, width, height);
        sprite_context.drawImage(image, sx, sy, swidth, sheight, -(swidth), 0, width, height);
        context.drawImage(sprite_canvas, x, y);
    } else {
        context.drawImage(image, sx, sy, swidth, sheight, x,  y, width, height);
    }
}
