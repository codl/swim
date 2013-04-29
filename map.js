var map = {
    generate: function(){
        map.context.fillStyle = "white";
        var highest = map.canvas.height;
        var jobs = 0;
        var processed = 0;
        var time = new Date() - 0;
        var queue = [];
        var width = map.canvas.width;
        var img = map.context.getImageData(0, 0, map.canvas.width, map.canvas.height);
        /*function gen(){
            for(var i = 0; i < 1000; i++){
                x+=1;
                if(x >= map.canvas.width){
                    x=0;
                    y+=1;
                    if(y >= map.canvas.height){
                        if(map.onready) map.onready();
                        return;
                    }
                }
                var v =
                    map.perlin.noise(x/900, y/900, 0)   +
                    map.perlin.noise(x/250, y/250, 0) +
                    map.perlin.noise(x/90, y/60, 0)/9 +
                    map.perlin.noise(x/3, y/3, 0)/100 +
                    linear(Math.pow(y / map.canvas.height, 2), 0, 1, -1, 1) +
                    Math.pow(linear(x, 0, map.canvas.width, -1, 1), 2);
                if(v > 0){
                    img.data[(x + y * width) * 4] = 255;
                    img.data[(x + y * width) * 4 + 1] = 255;
                    img.data[(x + y * width) * 4 + 2] = 255;
                    img.data[(x + y * width) * 4 + 3] = 255;
                }
            }
            progress(linear(y, 0, map.canvas.height, 0, 100), "Generating map...");
            realcontext.drawImage(map.canvas, 0, 0);
            window.setTimeout(gen, 0);
        }
        gen();
        */
        function floodfill(x, y){
            if(y < highest){
                highest = y;
            }
            img.data[(x + y * width) * 4] = 255; // transparent red, mark as seen
            var v =
                map.perlin.noise(x/900, y/900, 0)   +
                map.perlin.noise(x/250, y/250, 0) +
                map.perlin.noise(x/90, y/60, 0)/9 +
                map.perlin.noise(x/3, y/3, 0)/100 +
                linear(y, 0, map.canvas.height, -1, 1) +
                Math.pow(linear(x, 0, map.canvas.width, -1, 1), 2);
            if(v > 0){
                img.data[(x + y * width) * 4] = 255;
                img.data[(x + y * width) * 4 + 1] = 255;
                img.data[(x + y * width) * 4 + 2] = 255;
                img.data[(x + y * width) * 4 + 3] = 255;
                if(y > 0                     && img.data[(x   + (y-1) * width) * 4] === 0) { queue.push([x  , y-1]); img.data[(x   + (y-1) * width) * 4] = 255; }
                if(x < map.canvas.width - 1  && img.data[(x+1 + (y  ) * width) * 4] === 0) { queue.push([x+1, y  ]); img.data[(x+1 + (y  ) * width) * 4] = 255; }
                if(x > 0                     && img.data[(x-1 + (y  ) * width) * 4] === 0) { queue.push([x-1, y  ]); img.data[(x-1 + (y  ) * width) * 4] = 255; }
                if(y < map.canvas.height - 1 && img.data[(x   + (y+1) * width) * 4] === 0) { queue.push([x  , y+1]); img.data[(x   + (y+1) * width) * 4] = 255; }
            }
            processed += 1;
            var job = queue.shift();
            if(job){
                if(processed % 1500 === 0){
                    progress(linear(highest, map.canvas.height, 0, 0, 100), "Generating map, " + queue.length + " queued...");
                    window.setTimeout(floodfill, 0, job[0], job[1]);
                }
                else
                    floodfill(job[0], job[1]);
            }
            else {
                map.context.putImageData(img, 0, 0);
                map.imageData = img;
                console.log(map.canvas.width + "×" + map.canvas.height + " map successfully generated. Time taken : " + (new Date() - time));
                if(map.onready) map.onready();
            }
        }
        floodfill(map.canvas.width / 2,map.canvas.height-1);
    },
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    },
    collide: function(x, y){
        return map.imageData.data[(x + y*map.canvas.width) * 4 + 1] === 255;
    }
}

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = 5000;
    map.canvas.width = 5000;
    map.context = map.canvas.getContext("2d");
    map.perlin = new ClassicalNoise();
});
