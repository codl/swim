var pSide, pUp, pDown, pIdle;
var player = {
    realx: 0,
    realy: 0,
    x: 0,
    y: 0,
    xv: 0, // xvelocity i.e. how many pixels do we move horizontally each frame
    yv: 0,
    xa: 0, // xacceleration i.e. how much we change xv every frame
    ya: 0,
    directions: {
        left: false,
        up: false,
        right: false,
        down: false
    },
    bubbles: [],
    init: function(){
        pSide = new Image();
        pSide.src = "art/SIDE.png";
        pUp = new Image();
        pUp.src = "art/UP.png";
        pDown = new Image();
        pDown.src = "art/DOWN.png";
        pIdle = new Image();
        pIdle.src = "art/IDLE.png";
    },
    step: function(){
        with(player.directions){
            player.xa = left? (right? 0 : -0.1) : (right? 0.1 : 0)
            player.ya = up? (down? 0 : -0.1) : (down? 0.1 : 0)
        }
        player.realx += player.xv;
        player.realy += player.yv;
        player.xv += player.xa;
        player.yv += player.ya;
        // ↓ friction
        player.xv *= 0.95;
        player.yv *= 0.95;
        // ↓ gravity
        player.yv += 0.02 / (1 + Math.abs(player.xv));
        // inversely proportional to horizontal movement to simulate "gliding"

        // prevent smoothing
        player.x = Math.floor(player.realx);
        player.y = Math.floor(player.realy);

        // collision detection                                      ↓ will keep the sign (good for sprite direction) while making it effectively zero
        if     (map.collide(player.x+1, player.y  )) { player.xv /= 1000; player.x-= 1; player.realx -= 1; }
        else if(map.collide(player.x-1, player.y  )) { player.xv /= 1000; player.x+= 1; player.realx += 1; }
        if     (map.collide(player.x  , player.y+1)) { player.yv /= 1000; player.y-= 1; player.realy -= 1; }
        else if(map.collide(player.x  , player.y-1)) { player.yv /= 1000; player.y+= 1; player.realy += 1; }

        for(var i = 0; i < player.bubbles.length; i++){
            if(player.bubbles[i][1] < 50) continue;
            if(Math.random() < 1/2)
                player.bubbles[i][1] -= 1;
            else if(Math.random() < 1/2)
                player.bubbles[i][0] -= 1;
            else
                player.bubbles[i][0] += 1;
        }

        if(Math.random() < 1/120){
            player.bubbles.push([player.x, player.y]);
            if(player.bubbles.length > 30){
                player.bubbles.shift();
            }
        }
    },
    render: function(){
        if (player.directions.left === true) {                                                                  // ↓     centering the sprite    ↓
            animate_sprite(pSide, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1 - 7, player.y - viewport.y -1 - 5, 15, 10, false);
        } else if (player.directions.right === true) {
            animate_sprite(pSide, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1 - 7, player.y - viewport.y -1 - 5, 15, 10, true);
        } else if (player.directions.up === true) {
            animate_sprite(pUp,   (Math.floor(frame_counter / 4) % 4) * 15, 0, 15, 10, player.x - viewport.x - 1 - 7, player.y - viewport.y -1 - 5, 15, 10, player.xv >= 0);
        } else if (player.directions.down === true) {
            animate_sprite(pDown, (Math.floor(frame_counter / 4) % 6) * 15, 0, 15, 10, player.x - viewport.x - 1 - 7, player.y - viewport.y -1 - 5, 15, 10, player.xv >= 0);
        } else {                                        // ( frame_c / 4 ) % frames ) * 15
            animate_sprite(pIdle, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1 - 7, player.y - viewport.y -1 - 5, 15, 10, player.xv >= 0);
        }

        context.fillStyle = "white";
        for(var i = 0; i < player.bubbles.length; i++)
            if(player.bubbles[i][1] >= 50)
                context.fillRect(player.bubbles[i][0] - viewport.x, player.bubbles[i][1] - viewport.y, 1, 1);
    },
    keyup: function(e){
        switch(e.keyCode){
            case 37:
                player.directions.left = false;
                break;
            case 38:
                player.directions.up = false;
                break;
            case 39:
                player.directions.right = false;
                break;
            case 40:
                player.directions.down = false;
                break;
        }
    },
    keydown: function(e){
        switch(e.keyCode){
            case 37:
                player.directions.left = true;
                break;
            case 38:
                player.directions.up = true;
                break;
            case 39:
                player.directions.right = true;
                break;
            case 40:
                player.directions.down = true;
                break;
            default:
                return;
        }
        e.preventDefault();
    }
}

registeronload(function(){
    document.addEventListener("keydown", player.keydown, false);
    document.addEventListener("keyup", player.keyup, false);
});
