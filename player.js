var player = {
    x:  0,
    y:  0,
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
    init: function(){
        pSide = new Image();
        pSide.src = "art/SIDE.png";
        pUp = new Image();
        pUp.src = "art/UP.png";
        pDown = new Image();
        pDown.src = "art/DOWN.png"
        pIdle = new Image();
        pIdle.src = "art/IDLE.png"
    },
    step: function(){
        with(player.directions){
            //console.log(player.directions);
            player.xa = left? (right? 0 : -0.3) : (right? 0.3 : 0)
            player.ya = up? (down? 0 : -0.3) : (down? 0.3 : 0)
        }
        player.x += player.xv;
        player.y += player.yv;
        player.xv += player.xa;
        player.yv += player.ya;
        // friction
        player.xv *= 0.95;
        player.yv *= 0.95;
        // gravity
        player.yv += 0.02 / (1 + Math.abs(player.xv));
        // note : inversely proportional to horizontal movement to simulate "gliding"
    },
    render: function(){ /* TODO: ADD DIRECTIONS */
        if (player.directions.left === true) {
            context.drawImage(pSide, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1, player.y - viewport.y -1, 15, 10);
        } else if (player.directions.right === true) {
            context.drawImage(pSide, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1, player.y - viewport.y -1, 15, 10);
        } else if (player.directions.up === true) {
            context.drawImage(pUp, (Math.floor(frame_counter / 4) % 4) * 15, 0, 15, 10, player.x - viewport.x - 1, player.y - viewport.y -1, 15, 10);
        } else if (player.directions.down === true) {
            context.drawImage(pDown, (Math.floor(frame_counter / 4) % 6) * 15, 0, 15, 10, player.x - viewport.x - 1, player.y - viewport.y -1, 15, 10);
        } else {                                        // ( frame_c / 4 ) % frames ) * 15
            context.drawImage(pIdle, (Math.floor(frame_counter / 4) % 8) * 15, 0, 15, 10, player.x - viewport.x - 1, player.y - viewport.y -1, 15, 10);
        }
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
