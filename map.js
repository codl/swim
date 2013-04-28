var map = {
    generate: function(){
        map.context.fillStyle = "white";
        var data = map.imageData.data;
        var highest = map.canvas.height;
        var jobs = 0;
        var unsuccessful = 0;
        function floodfill(x, y){
            if(x >= 0 && y >= 0 && x < map.canvas.width && y < map.canvas.height &&
                    data[(x + y * map.canvas.width) * 4] !== 255){
                if(y < highest){
                    highest = y;
                }
                progress(linear(highest, map.canvas.height, 0, 0, 100), "Generating map, " + jobs + " jobs...")
                var v =
                    map.perlin.noise(linear(x, 0, 70, 0, 1), linear(y, 0, 40, 0, 1), 0) +
                    map.perlin.noise(linear(x, 0, 20, 0, 1), linear(y, 0, 20, 0, 1), 0) +
                    linear(y, 0, map.canvas.height, -1, 1) +
                    Math.abs(linear(x, 0, map.canvas.width, -1, 1));
                var fill = v > 0;
                if(fill){
                    data[(x + y * map.canvas.width) * 4]     = 255;
                    data[(x + y * map.canvas.width) * 4 + 1] = 255;
                    data[(x + y * map.canvas.width) * 4 + 2] = 255;
                    data[(x + y * map.canvas.width) * 4 + 3] = 255;
                    if(data[(x   + (y+1) * map.canvas.width) * 4] !== 255){
                        jobs += 1;
                        window.setTimeout(floodfill, 0, x  , y+1);
                    }
                    if(data[(x-1 + (y  ) * map.canvas.width) * 4] !== 255){
                        jobs += 1;
                        window.setTimeout(floodfill, 0, x-1, y  );
                    }
                    if(data[(x+1 + (y  ) * map.canvas.width) * 4] !== 255){
                        jobs += 1;
                        window.setTimeout(floodfill, 0, x+1, y  );
                    }
                    if(data[(x   + (y-1) * map.canvas.width) * 4] !== 255){
                        jobs += 1;
                        window.setTimeout(floodfill, 0, x  , y-1);
                    }
                } else
                    data[(x + y * map.canvas.width) * 4] = 255; // transparent red, so the pixel will be skipped by other workers
            }
            else {
                fill = true;
                unsuccessful += 1;
            }
            jobs -= 1;
            if(jobs === 0){
                map.context.putImageData(map.imageData, 0, 0);
                map.onready();
                // finalize
            }
            return fill;
        }
        floodfill(map.canvas.width / 2,map.canvas.height-1);
    },
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    }
}

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = 500;
    map.canvas.width = 500;
    map.context = map.canvas.getContext("2d");
    map.imageData = map.context.getImageData(0, 0, map.canvas.height, map.canvas.width);
    map.perlin = new ClassicalNoise();
});
