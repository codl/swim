var canvas;
var context;

window.onload = function(){
    var game = document.getElementById("game");
    var nojs = game.firstChild;
    game.removeChild(nojs);
    canvas = document.createElement("canvas");
    game.appendChild(canvas);
    canvas.width=640;
    canvas.height=480;
    context = canvas.getContext("2d");
}

function draw_test_tile() {
    //draw test tile.
    var img = new Image();
    img.src = "art/test.png";
    img.onload = function() {
        context.drawImage(img, viewport.x, viewport.y);
    };
}

var viewport = {
    x: 0, // in origin of viewport.
    y: 0, // in origin of viewport.
    pvx: 0, // player position within viewport.
    pvy: 0,
    // methods.
    update: function() {
        // this should track player movement.
        // update the position of the player INSIDE the
        // viewport, and adjust accordingly.
        viewport.pvx = player.x - viewport.x; // find player position within viewport
        viewport.pvy = player.y - viewport.y;

        if (viewport.pvx <= 128) {
            // nudge viewport <-
            viewport.x += viewport.pvx * 0.6;
            draw_test_tile();
        } else if (viewport.pvx >= 512) {
            // nudge viepowrt ->
            viewport.x -= (viewport.pvx - 512) * 0.6;
            draw_test_tile();
        }

        if (viewport.pvy <= 96) {
            // nudge viewport ^
            viewport.y += viewport.pvy * 0.6;
            draw_test_tile();
        } else if (viewport.pvy >= 384) {
            // nudge viewport v
            viewport.y -= (viewport.pvy - 384) * 0.6;
            draw_test_tile();
        }
    }
}