var map = {
    width:  4096,
    height: 4096,
    /*
    width: 1024,
    height: 1024,
    */
    generate: function(){
        map.context.fillStyle = "white";
        var time = new Date() - 0;
        var heightmap = new Float32Array((map.width+1) * (map.height+1));
        var background;

        // four corners
        heightmap[0] = 0;
        heightmap[map.width] = Math.random();
        heightmap[(map.width+1)*map.height] = 1;
        heightmap[(map.width+1)*(map.height+1)-1] = 1;

        function fill(res, x, y, callback, progressCallback){
            var processed = 0;
            while(x < map.width){
                while(y < map.height){
                    var topleft = heightmap[(map.width+1) * y + x];
                    var topright = heightmap[(map.width+1) * y + x + res];
                    var bottomleft = heightmap[(map.width+1) * (y+res) + x];
                    var bottomright = heightmap[(map.width+1) * (y+res) + x + res];

                    var topmid = (topleft + topright) / 2;
                    heightmap[(map.width+1) * y + x + Math.floor(res/2)] = topmid;

                    var leftmid = (topleft + bottomleft) / 2;
                    heightmap[(map.width+1) * (y+Math.floor(res/2)) + x] = leftmid;

                    var rightmid = (topright + bottomright) / 2;
                    heightmap[(map.width+1) * (y+Math.floor(res/2)) + x + res] = rightmid;

                    var bottommid = (bottomleft + bottomright) / 2;
                    heightmap[(map.width+1) * (y+res) + x + Math.floor(res/2)] = bottommid;

                    var turbulence = Math.pow(res/map.width, 0.7);
                    var center = (topleft + topright + bottomleft + bottomright) / 4 + linear(Math.random(), 0, 1, -turbulence, turbulence);
                    heightmap[(map.width+1) * (y+Math.floor(res/2)) + x + Math.floor(res/2)] = center;

                    y += res;
                    processed++;
                    if(processed > 20000){
                        window.setTimeout(fill, 0, res, x, y, callback, progressCallback);
                        return;
                    }
                }
                y = 0;
                x += res;
            }
            res = Math.floor(res/2);

            if(res > 1){
                progressCallback(res);
                window.setTimeout(fill, 0, res, 0, 0, callback, progressCallback);
            } 
            else {
                callback();
            }

        }


        function mapReady(){
            var img = map.context.getImageData(0, 0, map.width, map.height);

            for(var x = 0; x < map.width; x++){
                for(var y = 0; y < map.height; y++){
                    var value = heightmap[(map.width+1)*y + x] + linear(Math.pow(x - map.width/2, 2), 0, Math.pow(map.width/2, 2), 0, 0.3);
                    var bgvalue = value/2 + background[(map.width+1)*y + x]/2;
                    img.data[(x + y * map.width) * 4] = 255;
                    img.data[(x + y * map.width) * 4 + 1] = 255;
                    img.data[(x + y * map.width) * 4 + 2] = 255;

                    if(value > 0.5){
                        img.data[(x + y * map.width) * 4 + 3] = 255;
                    }
                    else if(bgvalue > 0.4){
                        img.data[(x + y * map.width) * 4 + 3] = 33;
                    }
                }
            }

            console.log("Generated in " + (new Date() - time) + "ms");
            map.context.putImageData(img, 0, 0);
            map.imageData = img;

            scenery.place(70);

            fish.spawn(700);

            // place player
            var x = -1, y = -1;
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

        function backgroundReady(){
            progress(50, "Generating map...");
            background = heightmap.subarray();
            window.setTimeout(fill, 0, map.width, 0, 0, mapReady, function(res){
                progress(linear(Math.pow(res, 0.5), Math.pow(map.width, 0.5), 0, 50, 95), "Generating map...");
            });
        }

        window.setTimeout(fill, 0, map.width, 0, 0, backgroundReady, function(res){
            progress(linear(Math.pow(res, 0.5), Math.pow(map.width, 0.5), 0, 0, 50), "Generating map...");
        });
    },
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    },
    collide: function(x, y){
        return x < 0 || x >= map.width ||
            y < 50 || y >= map.height ||
            map.imageData.data[(x + y*map.width) * 4 + 3] === 255;
    }
};

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = map.height;
    map.canvas.width = map.width;
    map.context = map.canvas.getContext("2d");
});
