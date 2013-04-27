var player = {
    x: 0,
    y: 0,
    xv: 0, // xvelocity i.e. how many pixels do we move horizontally each frame
    yv: 0,
    xa: 0, // xacceleration i.e. how much we change xv every frame
    ya: 0,
    angle: 0,
    step: function(){
        player.x += player.xv;
        player.y += player.yv;
        player.xv += player.xa;
        player.yv += player.ya;
        // friction
        player.xv *= 0.9;
        player.yv *= 0.9;
        // gravity
        player.yv += 20 / Math.abs(player.xv);
        // note : inversely proportional to horizontal movement to simulate "gliding"
    },
    keyup: function(e){
        switch(e.keyCode){
            case 37:
            case 39:
                player.xa = 0;
                break;
            case 38:
            case 40:
                player.ya = 0;
        }
    },
    keydown: function(e){
        switch(e.keyCode){
            case 37:
                player.xa = -30;
                break;
            case 38:
                player.ya = -30;
                break;
            case 39:
                player.xa =  30;
                break;
            case 40:
                player.ya =  30;
                break;
            default:
                return;
        }
        step();
        e.preventDefault();
    }
}

registeronload(function(){
    document.addEventListener("keydown", player.keydown, false);
    document.addEventListener("keyup", player.keyup, false);
});
