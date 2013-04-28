var map = {
    generate: function(){
        map.context.fillStyle = "white";
        var highest = map.canvas.height;
        var jobs = 0;
        var processed = 0;
        var time = new Date() - 0;
        var queue = [];
        var seen = Array(map.canvas.height * map.canvas.width);
        var width = map.canvas.width;
        function floodfill(x, y){
            if(x >= 0 && y >= 0 && x < map.canvas.width && y < map.canvas.height){
                seen[x + y * width] = true;
                if(y < highest){
                    highest = y;
                }
                var v =
                    map.perlin.noise(x/700, y/700, 0) +
                    map.perlin.noise(x/400, y/400, 0)/2 +
                    map.perlin.noise(x/80, y/80, 0)/3 +
                    map.perlin.noise(x/3, y/3, 0)/5 +
                    linear(y, 0, map.canvas.height, -1, 1) +
                    Math.pow(linear(x, 0, map.canvas.width, -1, 1), 2)/2;
                var fill = v > 0;
                if(fill){
                    map.context.fillRect(x, y, 1, 1);
                    if(y > 0                     && !seen[x   + (y-1) * width]){ seen[x   + (y-1) * width] = true; queue.push([x  , y-1]); }
                    if(x < map.canvas.width - 1  && !seen[x+1 + (y  ) * width]){ seen[x+1 + (y  ) * width] = true; queue.push([x+1, y  ]); }
                    if(x > 0                     && !seen[x-1 + (y  ) * width]){ seen[x-1 + (y  ) * width] = true; queue.push([x-1, y  ]); }
                    if(y < map.canvas.height - 1 && !seen[x   + (y+1) * width]){ seen[x   + (y+1) * width] = true; queue.push([x  , y+1]); }
                }
            }
            else { unsuccessful+= 1; }
            processed += 1;
            var job = queue.shift();
            if(job){
                if(processed % 1000 === 0){
                    progress(linear(highest, map.canvas.height, 0, 0, 100), "Generating map, " + queue.length + " jobs...");
                    realcontext.drawImage(map.canvas, 10, 50);
                    window.setTimeout(floodfill, 0, job[0], job[1]);
                }
                else
                    floodfill(job[0], job[1]);
            }
            else {
                console.log("last job");
                if(map.onready){
                    map.onready();
                    //map.onready = null;
                }
                console.log("Time taken : " + (new Date() - time));
            }
        }
        floodfill(map.canvas.width / 2,map.canvas.height-1);
    },
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    }
}

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = 1000;
    map.canvas.width = 2000;
    map.context = map.canvas.getContext("2d");
    map.imageData = map.context.getImageData(0, 0, map.canvas.height, map.canvas.width);
    map.perlin = new ClassicalNoise();
});
