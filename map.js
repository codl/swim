var map = {
    height:  1500,
    width:  10000,
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
        function floodfill(x, y){
            if(x > rightmost){
                rightmost = x;
            }
            img.data[(x + y * width) * 4] = 255; // transparent red, mark as seen
            var v =
                map.perlin.noise(x/900, y/900, 0)   +
                map.perlin.noise(x/250, y/250, 0) +
                map.perlin.noise(x/90, y/60, 0)/9 +
                map.perlin.noise(x/3, y/3, 0)/100 +
                linear(y, 0, map.canvas.height, -1, 1)*2 +
                Math.pow(linear(x, 0, map.width, -1, 1), 6)
                - 0.1;
            if(v > 0){
                //img.data[(x + y * width) * 4] = 255; // already done up there ↑
                img.data[(x + y * width) * 4 + 1] = 255;
                img.data[(x + y * width) * 4 + 2] = 255;
                img.data[(x + y * width) * 4 + 3] = 255;
                if(y > 0                     && img.data[(x   + (y-1) * width) * 4] === 0) { queue.push      ([x  , y-1]); img.data[(x   + (y-1) * width) * 4] = 255; }
                if(x < map.canvas.width - 1  && img.data[(x+1 + (y  ) * width) * 4] === 0) { queue_right.push([x+1, y  ]); img.data[(x+1 + (y  ) * width) * 4] = 255; }
                if(x > 0                     && img.data[(x-1 + (y  ) * width) * 4] === 0) { queue.push      ([x-1, y  ]); img.data[(x-1 + (y  ) * width) * 4] = 255; }
                if(y < map.canvas.height - 1 && img.data[(x   + (y+1) * width) * 4] === 0) { queue.push      ([x  , y+1]); img.data[(x   + (y+1) * width) * 4] = 255; }
            }
            processed += 1;
            var job = queue.shift() || queue_right.shift();
            if(job){
                if(processed % 1500 === 0){
                    progress(linear(rightmost, 0, map.width, 0, 95), "Generating map, " + (queue.length + queue_right.length) + " queued...");
                    window.setTimeout(floodfill, 0, job[0], job[1]);
                }
                else
                    floodfill(job[0], job[1]);
            }
            else {
                if(processed < map.width*map.height/8){ processed = 0; floodfill(x+1, y); return; } // we landed on a tiny island or empty space, try again
                map.context.putImageData(img, 0, 0);
                map.imageData = img;
                console.log(map.width + "×" + map.height + " map successfully generated. Time taken : " + (new Date() - time));

                // place scenery
                // TODO

                // place player
                x = -1; y = -1;
                progress(100, "Spawning player");
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
            }
        }
        floodfill(0, map.height-1);
    },
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    },
    collide: function(x, y){
        return x < 0 || x >= map.width ||
            y < 0 || y >= map.height ||
            map.imageData.data[(x + y*map.width) * 4 + 1] === 255;
    }
}

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = map.height;
    map.canvas.width = map.width;
    map.context = map.canvas.getContext("2d");
    map.perlin = new ClassicalNoise();
});
