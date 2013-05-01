var map = {
    width: 5000,
    height: 2000,
    generate: function(){
        map.context.fillStyle = "white";
        var rightmost = 0;
        var jobs = 0;
        var processed = 0;
        var time = new Date() - 0;
        var queue = [];
        var queue_right = [];
        var width = map.width;
        var img = map.context.getImageData(0, 0, map.width, map.height);
        var x, y;
        function v(x, y, z){
            return map.perlin.noise(x/900, y/900, z?z:0) +
                map.perlin.noise(x/250, y/250, z?z:0) +
                map.perlin.noise(x/90, y/60, z?z:0)/9 +
                map.perlin.noise(x/3, y/3, 0)/100 +
                linear(y, 0, map.canvas.height, -1, 1) +
                Math.pow(linear(x, 0, map.width, -1, 1), 4);
        }
        function floodfill(){
            while(true){
                processed += 1;
                var job = queue.shift() || queue_right.shift();
                if(!job) {
                    if(processed < map.width*map.height/8){ // we landed on a tiny island or empty space, try again
                        processed = 0;
                        queue.push([x+1, map.height - 1]);
                        window.setTimeout(floodfill, 0);
                        return;
                    }
                    console.log("Generated in " + (new Date() - time) + "ms");
                    map.context.putImageData(img, 0, 0);
                    map.imageData = img;

                    scenery.place(70);

                    fish.spawn(700);

                    // place player
                    x = -1; y = -1;
                    while(map.collide(x, y)){
                        x = Math.floor(Math.random() * map.width);
                        y = Math.floor(Math.random() * 50) + 50;
                    }
                    player.realx = x;
                    player.realy = y;

                    // place viewpoint
                    viewport.x = x - 100;
                    viewport.y = y - 100;

                    if(map.onready) map.onready();
                    return;
                }
                x = job[0];
                y = job[1];

                if(x > rightmost){
                    rightmost = x;
                }

                img.data[(x + y * width) * 4] = 255; // transparent red, mark as seen
                var bg = v(x, y, 0.5) > -0.1;
                var fg = v(x, y, 0) > 0.1;
                if(bg || fg){
                    //img.data[(x + y * width) * 4] = 255; // already done up there ↑
                    img.data[(x + y * width) * 4 + 1] = 255;
                    img.data[(x + y * width) * 4 + 2] = 255;
                    img.data[(x + y * width) * 4 + 3] = fg?255:31;
                    if(y > 0                     && img.data[(x   + (y-1) * width) * 4] === 0) { queue.push      ([x  , y-1]); img.data[(x   + (y-1) * width) * 4] = 255; }
                    if(x < map.canvas.width - 1  && img.data[(x+1 + (y  ) * width) * 4] === 0) { queue_right.push([x+1, y  ]); img.data[(x+1 + (y  ) * width) * 4] = 255; }
                    if(x > 0                     && img.data[(x-1 + (y  ) * width) * 4] === 0) { queue.push      ([x-1, y  ]); img.data[(x-1 + (y  ) * width) * 4] = 255; }
                    if(y < map.canvas.height - 1 && img.data[(x   + (y+1) * width) * 4] === 0) { queue.push      ([x  , y+1]); img.data[(x   + (y+1) * width) * 4] = 255; }
                }

                if(processed % 2000 === 0){
                    progress(linear(rightmost, 0, map.width, 0, 95), "Generating map...");
                    window.setTimeout(floodfill, 0);
                    return;
                }
            }
        }
        queue.push([0, map.height-1]);
        floodfill();
    },
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    },
    collide: function(x, y){
        return x < 0 || x >= map.width ||
            y < 50 || y >= map.height ||
            map.imageData.data[(x + y*map.width) * 4 + 3] === 255;
    }
}

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = map.height;
    map.canvas.width = map.width;
    map.context = map.canvas.getContext("2d");
    map.perlin = new ClassicalNoise();
});
