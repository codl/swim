var fish = {
    Fish: function(){
        this.realx = Math.random() * map.width;
        this.realy = Math.random() * map.height;
        this.xv= 0;
        this.yv= 0;
        this.xa= 0;
        this.ya= 0;
        this.x= 0;
        this.y= 0;
        this.space_out = Math.random() * 60;
        this.follower = Math.random() > 0.3;
        fish.fishes.push(this); // sounds fishy LERLERLERL
        return this;
    },
    fishes: [],
    spawn: function(count){
        if(!count) count = 1;
        for(var j = 0; j < count; j++)
            new fish.Fish();
    },
    step: function(){
        for(var i = 0; i < fish.fishes.length; i++){
            fish.fishes[i].step();
        }
    },
    render: function(){
        for(var i = 0; i < fish.fishes.length; i++){
            if(fish.fishes[i].x > viewport.x - 1 && fish.fishes[i].x < viewport.x + canvas.width + 1 &&
               fish.fishes[i].y > viewport.y && fish.fishes[i].y < viewport.y + canvas.height)
                fish.fishes[i].render();

        }
    }
};

fish.Fish.prototype.render = function(){
    context.fillStyle = "white";
    context.fillRect(this.x - viewport.x - 1, this.y - viewport.y, 3, 1);
};

fish.Fish.prototype.step = function(){
    this.realx += this.xv;
    this.realy += this.yv;
    this.xv += this.xa;
    this.yv += this.ya;
    this.xv *= 0.99; // fish are slippery
    this.yv *= 0.90;
    this.xa *= 0.5;
    this.ya *= 0.5;

    var neighbour_count = 0;
    var neighbour_xv = 0;
    var neighbour_yv = 0;
    if(this.follower){
        for(var i = Math.floor(Math.random() * 6); i < fish.fishes.length; i+=6){
            if(Math.abs(this.realx - fish.fishes[i].realx) < 50 &&
            Math.abs(this.realy - fish.fishes[i].realy) < 50 &&
            Math.abs(fish.fishes[i].xv) > 0.1 &&
            Math.abs(fish.fishes[i].yv) > 0.1){
                neighbour_count += 1;
                neighbour_xv += fish.fishes[i].xv;
                neighbour_yv += fish.fishes[i].yv;
            }
        }
        if(neighbour_count != 0){
            this.xa += ((neighbour_xv / neighbour_count) - this.xv)*Math.random();
            this.ya += ((neighbour_yv / neighbour_count) - this.yv)*Math.random()/4;
        }
    }
    if(this.space_out <= 0){
        this.xa = linear(Math.random(), 0, 1, -1, 1);
        this.ya = linear(Math.random(), 0, 1, -1, 1);
        this.space_out = Math.random() * 60 * ((this.follower)?30:10)
    }
    this.space_out -= 1;

    // swim away from the player
    if(Math.abs(player.x - this.x) < 30 &&
       Math.abs(player.y - this.y) < 30){
        this.xa = sign(this.x - player.x) * Math.random();
        this.ya = sign(this.y - player.y) * Math.random();
    }

    this.x = Math.floor(this.realx);
    this.y = Math.floor(this.realy);
    // collision detection
    if     (this.x < 0)          { this.xv *= -1; this.x = 0; this.realx = 0; }
    else if(this.x > map.width)  { this.xv *= -1; this.x = map.width; this.realx = map.width; }
    if     (this.y < 50)         { this.yv *= -1; this.y = 50; this.realy = 50; }
    else if(this.y > map.height) { this.yv *= -1; this.y = map.height; this.realy = map.height; }
};
